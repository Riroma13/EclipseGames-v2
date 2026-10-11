import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { openStore } from "./store.mjs";
const email = process.env.ECLIPSE_TEACHER_EMAIL?.trim().toLowerCase();
const password = process.env.ECLIPSE_TEACHER_PASSWORD;
if (!email || !password || password.length < 12)
  throw new Error(
    "Define ECLIPSE_TEACHER_EMAIL y ECLIPSE_TEACHER_PASSWORD (mínimo 12 caracteres).",
  );
const db = openStore();
if (db.prepare("SELECT id FROM teachers WHERE email=?").get(email))
  throw new Error("La docente ya existe. No se sobrescribe.");
const id = randomUUID(),
  salt = randomBytes(16).toString("hex");
db.exec("BEGIN");
try {
  db.prepare("INSERT INTO teachers VALUES(?,?,?,?)").run(
    id,
    email,
    scryptSync(password, salt, 64).toString("hex"),
    salt,
  );
  if (process.argv.includes("--demo")) {
    const names = [
      "Alba Martín",
      "Bruno Soler",
      "Carla Vega",
      "Daniel Gil",
      "Elena Ramos",
    ];
    for (const suffix of ["A", "B"]) {
      const group = randomUUID();
      db.prepare("INSERT INTO groups VALUES(?,?,?)").run(
        group,
        id,
        `1.º ESO · ${suffix} · Ficticio`,
      );
      for (let i = 0; i < 30; i++)
        db.prepare("INSERT INTO students VALUES(?,?,?,?)").run(
          randomUUID(),
          group,
          `${names[i % 5]} ${i + 1}`,
          `Éclipse ${String(i + 1).padStart(2, "0")}`,
        );
    }
  }
  db.exec("COMMIT");
  console.log("Docente creada. Datos ficticios solo si se indicó --demo.");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}
