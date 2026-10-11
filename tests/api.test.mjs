import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { openStore } from "../server/store.mjs";
import { createApi } from "../server/api.mjs";
test("auth, ownership, persisted RT, absence, undo and concurrency", async () => {
  const dir = mkdtempSync(join(tmpdir(), "eclipse-api-")),
    path = join(dir, "test.sqlite"),
    password = randomUUID() + randomUUID();
  execFileSync(process.execPath, ["server/bootstrap.mjs", "--demo"], {
    env: {
      ...process.env,
      ECLIPSE_DB: path,
      ECLIPSE_TEACHER_EMAIL: "test@example.test",
      ECLIPSE_TEACHER_PASSWORD: password,
    },
  });
  let db = openStore(path),
    server = createApi(db);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let url = `http://127.0.0.1:${server.address().port}`,
    cookie = "";
  const call = async (path, body, extra = {}) => {
    const res = await fetch(url + "/api/" + path, {
      headers: { "Content-Type": "application/json", Cookie: cookie, ...extra },
      ...(body ? { method: "POST", body: JSON.stringify(body) } : {}),
    });
    return {
      status: res.status,
      value: await res.json(),
      cookie: res.headers.get("set-cookie"),
    };
  };
  try {
    assert.equal((await call("groups")).status, 401);
    assert.equal(
      (await call("login", { email: "test@example.test", password: "wrong" }))
        .status,
      401,
    );
    const login = await call("login", { email: "test@example.test", password });
    assert.equal(login.status, 200);
    assert.match(login.cookie, /HttpOnly/);
    cookie = login.cookie.split(";")[0];
    const groups = (await call("groups")).value;
    const base = "groups/" + groups[0].id;
    assert.equal((await call("groups/not-owned")).status, 404);
    assert.equal(
      (await call(base + "/start", {}, { Origin: "https://other.test" }))
        .status,
      403,
    );
    let state = (await call(base + "/start", {})).value,
      s = state.sessions[0];
    assert.equal((await call(base + "/start", {})).status, 409);
    assert.equal(
      (
        await call(base + "/rt", {
          session: s.id,
          version: 0,
          rt: { foreign: "10" },
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await call(base + "/rt", {
          session: s.id,
          version: 0,
          rt: { [state.students[0].id]: "7" },
        })
      ).status,
      400,
    );
    const rt = Object.fromEntries(state.students.map((x) => [x.id, "10"]));
    rt[state.students[0].id] = "A";
    rt[state.students[1].id] = "";
    rt[state.students[2].id] = "0";
    const saved = await call(base + "/rt", { session: s.id, version: 0, rt });
    assert.equal(saved.status, 200);
    s = saved.value.sessions[0];
    assert.deepEqual(s.rt, rt);
    assert.equal(s.version, 1);
    assert.equal(
      (await call(base + "/rt", { session: s.id, version: 0, rt: {} })).status,
      409,
    );
    assert.deepEqual((await call("groups/" + groups[1].id)).value.sessions, []);
    await new Promise((r) => server.close(r));
    db.close();
    db = openStore(path);
    server = createApi(db);
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    url = `http://127.0.0.1:${server.address().port}`;
    assert.deepEqual((await call(base)).value.sessions[0].rt, rt);
    const undone = await call(base + "/undo", {
      session: s.id,
      version: s.version,
    });
    assert.equal(undone.status, 200);
    s = undone.value.sessions[0];
    assert.deepEqual(s.rt, {});
    assert.equal(s.history.length, 2);
    assert.equal(
      (await call(base + "/undo", { session: s.id, version: s.version }))
        .status,
      409,
    );
    assert.equal(
      (await call(base + "/end", { session: s.id, version: s.version })).status,
      200,
    );
    assert.equal(
      (await call(base + "/rt", { session: s.id, version: 3, rt })).status,
      409,
    );
    const next = (await call(base + "/start", {})).value;
    assert.equal(next.sessions.length, 2);
    assert.deepEqual(next.sessions[0].rt, {});
    const other = randomUUID();
    db.prepare("INSERT INTO teachers VALUES(?,?,?,?)").run(
      other,
      "other@example.test",
      "unused",
      "unused",
    );
    const gid = randomUUID();
    db.prepare("INSERT INTO groups VALUES(?,?,?)").run(gid, other, "Privado");
    assert.equal((await call("groups/" + gid)).status, 404);
    await call("logout", {});
    assert.equal((await call("groups")).status, 401);
  } finally {
    await new Promise((r) => server.close(r));
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
