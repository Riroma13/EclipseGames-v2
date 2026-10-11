import { createServer } from "node:http";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { fileURLToPath } from "node:url";
import { openStore } from "./store.mjs";
const digest = (token) => createHash("sha256").update(token).digest("hex");
export function createApi(db = openStore()) {
  const attempts = new Map();
  const server = createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const send = (status, value) => {
      res.writeHead(status);
      res.end(JSON.stringify(value));
    };
    const fail = (status, message) => {
      const e = new Error(message);
      e.status = status;
      throw e;
    };
    try {
      const path = new URL(req.url, "http://localhost").pathname;
      if (req.method === "GET" && path === "/api/health")
        return send(200, { ok: true });
      if (!["GET", "POST"].includes(req.method))
        fail(405, "Método no permitido.");
      if (
        req.method === "POST" &&
        req.headers.origin &&
        ![
          process.env.ECLIPSE_ORIGIN || "http://localhost:5173",
          "http://127.0.0.1:5173",
        ].includes(req.headers.origin)
      )
        fail(403, "Origen no permitido.");
      let body = {};
      if (req.method === "POST") {
        if (!req.headers["content-type"]?.startsWith("application/json"))
          fail(415, "Se requiere JSON.");
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (raw.length > 65536) fail(413, "Petición demasiado grande.");
        }
        try {
          body = JSON.parse(raw);
        } catch {
          fail(400, "JSON inválido.");
        }
        if (!body || typeof body !== "object" || Array.isArray(body))
          fail(400, "Objeto inválido.");
      }
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
      if (path === "/api/login" && req.method === "POST") {
        const key = req.socket.remoteAddress,
          now = Date.now(),
          entry = attempts.get(key);
        if (entry && entry.until > now && entry.count >= 10)
          fail(429, "Demasiados intentos. Espera 15 minutos.");
        const teacher =
          typeof body.email === "string"
            ? db
                .prepare("SELECT * FROM teachers WHERE email=?")
                .get(body.email.trim().toLowerCase())
            : null;
        const candidate = scryptSync(
          typeof body.password === "string" && body.password.length <= 1024
            ? body.password
            : "",
          teacher?.salt || "invalid",
          64,
        );
        if (
          !teacher ||
          !timingSafeEqual(candidate, Buffer.from(teacher.hash, "hex"))
        ) {
          attempts.set(key, {
            count: entry?.until > now ? entry.count + 1 : 1,
            until: entry?.until > now ? entry.until : now + 900000,
          });
          fail(401, "Correo o contraseña incorrectos.");
        }
        attempts.delete(key);
        const token = randomBytes(32).toString("hex");
        db.prepare("DELETE FROM logins WHERE expires<?").run(now);
        db.prepare("INSERT INTO logins VALUES(?,?,?)").run(
          digest(token),
          teacher.id,
          now + 28800000,
        );
        res.setHeader(
          "Set-Cookie",
          `eclipse_session=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=28800${secure}`,
        );
        return send(200, { email: teacher.email });
      }
      const token = req.headers.cookie
        ?.split(";")
        .map((x) => x.trim())
        .find((x) => x.startsWith("eclipse_session="))
        ?.slice(16);
      const login =
        token &&
        db
          .prepare("SELECT teacher FROM logins WHERE token=? AND expires>?")
          .get(digest(token), Date.now());
      if (!login) fail(401, "Inicia sesión docente.");
      const teacher = login.teacher;
      if (path === "/api/logout" && req.method === "POST") {
        db.prepare("DELETE FROM logins WHERE token=?").run(digest(token));
        res.setHeader(
          "Set-Cookie",
          `eclipse_session=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0${secure}`,
        );
        return send(200, { ok: true });
      }
      if (path === "/api/me" && req.method === "GET")
        return send(200, {
          email: db
            .prepare("SELECT email FROM teachers WHERE id=?")
            .get(teacher).email,
        });
      if (path === "/api/groups" && req.method === "GET")
        return send(
          200,
          db
            .prepare("SELECT id,name FROM groups WHERE teacher=? ORDER BY name")
            .all(teacher),
        );
      if (path === "/api/groups" && req.method === "POST") {
        if (
          typeof body.name !== "string" ||
          !body.name.trim() ||
          body.name.length > 100 ||
          !Array.isArray(body.students) ||
          body.students.length < 1 ||
          body.students.length > 300 ||
          body.students.some(
            (name) =>
              typeof name !== "string" || !name.trim() || name.length > 150,
          )
        )
          fail(
            400,
            "Indica nombre de grupo y entre 1 y 300 alumnos (un nombre por línea).",
          );
        const id = randomUUID();
        db.exec("BEGIN IMMEDIATE");
        try {
          db.prepare("INSERT INTO groups VALUES(?,?,?)").run(
            id,
            teacher,
            body.name.trim(),
          );
          body.students.forEach((name, i) =>
            db
              .prepare("INSERT INTO students VALUES(?,?,?,?)")
              .run(
                randomUUID(),
                id,
                name.trim(),
                `Éclipse ${String(i + 1).padStart(2, "0")}`,
              ),
          );
          db.exec("COMMIT");
        } catch (e) {
          db.exec("ROLLBACK");
          throw e;
        }
        return send(201, { id, name: body.name.trim() });
      }
      const match = path.match(
        /^\/api\/groups\/([^/]+)(?:\/(start|end|rt|undo|xp|xp-undo))?$/,
      );
      if (!match) fail(404, "Ruta no disponible.");
      const group = db
        .prepare("SELECT id,name FROM groups WHERE id=? AND teacher=?")
        .get(match[1], teacher);
      if (!group) fail(404, "Grupo no disponible.");
      const roster = db
        .prepare(
          "SELECT id,name,alias FROM students WHERE group_id=? ORDER BY name",
        )
        .all(group.id);
      const state = () => ({
        group,
        students: roster,
        xpEvents: db
          .prepare(
            `SELECT x.id,x.student,x.category,x.value,x.time,
          t.email AS teacher,r.time AS reversedAt,rt.email AS reversedBy
          FROM xp_observations x JOIN teachers t ON t.id=x.teacher
          LEFT JOIN xp_reversals r ON r.observation=x.id
          LEFT JOIN teachers rt ON rt.id=r.teacher
          WHERE x.group_id=? ORDER BY x.rowid DESC`,
          )
          .all(group.id),
        sessions: db
          .prepare(
            "SELECT * FROM sessions WHERE group_id=? ORDER BY startedAt DESC,rowid DESC",
          )
          .all(group.id)
          .map((s) => ({
            ...s,
            active: !s.endedAt,
            rt: JSON.parse(s.rt),
            history: db
              .prepare(
                "SELECT id,time,kind,before,after FROM rt_history WHERE session=? ORDER BY rowid DESC",
              )
              .all(s.id)
              .map((h) => ({
                ...h,
                before: JSON.parse(h.before),
                after: JSON.parse(h.after),
              })),
          })),
      });
      if (!match[2] && req.method === "GET") return send(200, state());
      if (req.method !== "POST") fail(405, "Método no permitido.");
      if (match[2] === "xp" || match[2] === "xp-undo") {
        db.exec("BEGIN IMMEDIATE");
        try {
          if (match[2] === "xp") {
            if (
              !roster.some((s) => s.id === body.student) ||
              ![
                "Comunicación",
                "Precisión",
                "Constancia",
                "Colaboración",
              ].includes(body.category) ||
              ![1, 2, 3].includes(body.value) ||
              typeof body.requestId !== "string" ||
              !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                body.requestId,
              )
            )
              fail(
                400,
                "Alumno, categoría, valor o identificador XP inválido.",
              );
            const previous = db
              .prepare(
                "SELECT * FROM xp_observations WHERE teacher=? AND request_id=?",
              )
              .get(teacher, body.requestId);
            if (previous) {
              if (
                previous.group_id !== group.id ||
                previous.student !== body.student ||
                previous.category !== body.category ||
                previous.value !== body.value
              )
                fail(
                  409,
                  "Este identificador ya corresponde a otra observación.",
                );
            } else {
              db.prepare(
                "INSERT INTO xp_observations VALUES(?,?,?,?,?,?,?,?)",
              ).run(
                randomUUID(),
                body.requestId,
                group.id,
                body.student,
                teacher,
                new Date().toISOString(),
                body.category,
                body.value,
              );
            }
          } else {
            if (typeof body.event !== "string")
              fail(400, "Selecciona una observación.");
            const event = db
              .prepare(
                "SELECT id FROM xp_observations WHERE id=? AND group_id=?",
              )
              .get(body.event, group.id);
            if (!event) fail(404, "Observación no disponible.");
            db.prepare("INSERT OR IGNORE INTO xp_reversals VALUES(?,?,?)").run(
              event.id,
              teacher,
              new Date().toISOString(),
            );
          }
          db.exec("COMMIT");
        } catch (e) {
          db.exec("ROLLBACK");
          throw e;
        }
        return send(200, state());
      }
      db.exec("BEGIN IMMEDIATE");
      try {
        const active = db
          .prepare(
            "SELECT * FROM sessions WHERE group_id=? AND endedAt IS NULL",
          )
          .get(group.id);
        if (match[2] === "start") {
          if (active) fail(409, "Ya existe una sesión activa.");
          db.prepare(
            "INSERT INTO sessions(id,group_id,startedAt) VALUES(?,?,?)",
          ).run(randomUUID(), group.id, new Date().toISOString());
        } else {
          if (
            !active ||
            body.session !== active.id ||
            body.version !== active.version
          )
            fail(409, "La sesión cambió. Actualiza antes de guardar.");
          if (match[2] === "end")
            db.prepare(
              "UPDATE sessions SET endedAt=?,version=version+1 WHERE id=?",
            ).run(new Date().toISOString(), active.id);
          else {
            let rt = body.rt,
              kind = "save";
            if (match[2] === "undo") {
              const last = db
                .prepare(
                  "SELECT * FROM rt_history WHERE session=? ORDER BY rowid DESC LIMIT 1",
                )
                .get(active.id);
              if (!last || last.kind !== "save")
                fail(409, "No hay un guardado pendiente de deshacer.");
              rt = JSON.parse(last.before);
              kind = "undo";
            }
            if (!rt || typeof rt !== "object" || Array.isArray(rt))
              fail(400, "Lote RT inválido.");
            const ids = new Set(roster.map((s) => s.id));
            if (
              Object.entries(rt).some(
                ([id, value]) =>
                  !ids.has(id) || !["", "10", "5", "0", "A"].includes(value),
              )
            )
              fail(400, "Alumno o valor RT inválido.");
            const after = JSON.stringify(rt);
            db.prepare("INSERT INTO rt_history VALUES(?,?,?,?,?,?,?)").run(
              randomUUID(),
              active.id,
              teacher,
              new Date().toISOString(),
              active.rt,
              after,
              kind,
            );
            db.prepare(
              "UPDATE sessions SET rt=?,version=version+1 WHERE id=?",
            ).run(after, active.id);
          }
        }
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
      return send(200, state());
    } catch (error) {
      send(error.status || 500, {
        error: error.status ? error.message : "No se pudo guardar. Reintenta.",
      });
    }
  });
  return server;
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  createApi().listen(Number(process.env.PORT || 3001), "127.0.0.1", () =>
    console.log("API Eclipse en puerto 3001"),
  );
