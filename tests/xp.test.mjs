import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { openStore } from "../server/store.mjs";
import { createApi } from "../server/api.mjs";
test("XP: ownership, fixed rubric values, idempotent retry, immutable reversal, restart and RT isolation", async () => {
  const dir = mkdtempSync(join(tmpdir(), "eclipse-xp-")),
    file = join(dir, "test.sqlite"),
    password = randomUUID() + randomUUID();
  execFileSync(process.execPath, ["server/bootstrap.mjs", "--demo"], {
    env: {
      ...process.env,
      ECLIPSE_DB: file,
      ECLIPSE_TEACHER_EMAIL: "xp@example.test",
      ECLIPSE_TEACHER_PASSWORD: password,
    },
  });
  execFileSync(process.execPath, ["server/bootstrap.mjs", "--demo"], {
    env: {
      ...process.env,
      ECLIPSE_DB: file,
      ECLIPSE_TEACHER_EMAIL: "other@example.test",
      ECLIPSE_TEACHER_PASSWORD: password,
    },
  });
  let db = openStore(file),
    server = createApi(db);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let url = `http://127.0.0.1:${server.address().port}`,
    cookie = "";
  const call = async (path, body) => {
    const res = await fetch(url + "/api/" + path, {
      headers: { "Content-Type": "application/json", Cookie: cookie },
      ...(body ? { method: "POST", body: JSON.stringify(body) } : {}),
    });
    return {
      status: res.status,
      value: await res.json(),
      cookie: res.headers.get("set-cookie"),
    };
  };
  try {
    assert.equal(
      (await call("groups/unknown/xp", { student: "x" })).status,
      401,
    );
    cookie = (
      await call("login", { email: "xp@example.test", password })
    ).cookie.split(";")[0];
    const groups = (await call("groups")).value,
      base = `groups/${groups[0].id}`;
    const initial = (await call(base)).value,
      student = initial.students[0].id,
      foreignStudent = (await call(`groups/${groups[1].id}`)).value.students[0]
        .id;
    const body = {
      student,
      category: "Comunicación",
      value: 2,
      requestId: randomUUID(),
    };
    for (const invalid of [
      { category: "Nota" },
      { value: 0 },
      { value: -1 },
      { value: 4 },
      { value: "2" },
      { student: foreignStudent },
      { requestId: "unsafe" },
      { requestId: null },
    ])
      assert.equal(
        (await call(base + "/xp", { ...body, ...invalid })).status,
        400,
      );
    assert.equal((await call(base + "/xp", body)).status, 200);
    const saved = (await call(base + "/xp", body)).value;
    assert.equal(saved.xpEvents.length, 1);
    assert.equal(saved.xpEvents[0].value, 2);
    assert.equal(saved.xpEvents[0].teacher, "xp@example.test");
    assert.ok(saved.xpEvents[0].time);
    assert.deepEqual(saved.sessions, []);
    assert.equal((await call(base + "/xp", { ...body, value: 3 })).status, 409);
    const event = saved.xpEvents[0];
    assert.equal(
      (await call(`groups/${groups[1].id}/xp-undo`, { event: event.id }))
        .status,
      404,
    );
    const session = (await call(base + "/start", {})).value.sessions[0];
    const rt = { [student]: "A" };
    const withRt = (
      await call(base + "/rt", {
        session: session.id,
        version: session.version,
        rt,
      })
    ).value;
    for (const category of ["Precisión", "Constancia", "Colaboración"])
      assert.equal(
        (
          await call(base + "/xp", {
            ...body,
            category,
            value: 3,
            requestId: randomUUID(),
          })
        ).status,
        200,
      );
    const beforeUndo = (await call(base)).value;
    assert.deepEqual(beforeUndo.sessions, withRt.sessions);
    const undone = await call(base + "/xp-undo", { event: event.id });
    assert.equal(undone.status, 200);
    const reversed = undone.value.xpEvents.find((e) => e.id === event.id);
    assert.equal(reversed.value, 2);
    assert.equal(reversed.time, event.time);
    assert.ok(reversed.reversedAt);
    assert.equal(reversed.reversedBy, "xp@example.test");
    assert.deepEqual(
      (await call(base + "/xp-undo", { event: event.id })).value.xpEvents,
      undone.value.xpEvents,
    );
    assert.equal(
      db.prepare("SELECT COUNT(*) AS n FROM xp_reversals").get().n,
      1,
    );
    assert.equal((await call(base + "/xp", body)).value.xpEvents.length, 4);
    assert.ok(
      (await call(base + "/xp", body)).value.xpEvents.find(
        (e) => e.id === event.id,
      ).reversedAt,
    );
    await new Promise((r) => server.close(r));
    db.close();
    db = openStore(file);
    server = createApi(db);
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    url = `http://127.0.0.1:${server.address().port}`;
    const restored = (await call(base)).value;
    assert.equal(restored.xpEvents.length, 4);
    assert.deepEqual(restored.sessions, withRt.sessions);
    assert.equal(
      restored.xpEvents
        .filter((e) => !e.reversedAt)
        .reduce((sum, e) => sum + e.value, 0),
      9,
    );
    cookie = (
      await call("login", { email: "other@example.test", password })
    ).cookie.split(";")[0];
    assert.equal((await call(base)).status, 404);
    assert.equal(
      (await call(base + "/xp", { ...body, requestId: randomUUID() })).status,
      404,
    );
    assert.equal(
      (await call(base + "/xp-undo", { event: event.id })).status,
      404,
    );
  } finally {
    await new Promise((r) => server.close(r));
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("Actualización de base anterior añade XP y conserva docentes, grupos y RT", () => {
  const dir = mkdtempSync(join(tmpdir(), "eclipse-upgrade-")),
    file = join(dir, "existing.sqlite");
  let db = openStore(file);
  try {
    db.prepare("INSERT INTO teachers VALUES(?,?,?,?)").run(
      "teacher",
      "existing@example.test",
      "hash",
      "salt",
    );
    db.prepare("INSERT INTO groups VALUES(?,?,?)").run(
      "group",
      "teacher",
      "Grupo existente",
    );
    db.prepare("INSERT INTO students VALUES(?,?,?,?)").run(
      "student",
      "group",
      "Nombre ficticio",
      "Éclipse 01",
    );
    db.prepare(
      "INSERT INTO sessions(id,group_id,startedAt,rt,version) VALUES(?,?,?,?,?)",
    ).run("session", "group", "2026-10-09T08:00:00Z", '{"student":"A"}', 1);
    db.exec("DROP TABLE xp_reversals; DROP TABLE xp_observations;");
    db.close();
    db = openStore(file);
    assert.equal(
      db.prepare("SELECT email FROM teachers").get().email,
      "existing@example.test",
    );
    assert.equal(
      db.prepare("SELECT name FROM groups").get().name,
      "Grupo existente",
    );
    assert.equal(
      db.prepare("SELECT rt FROM sessions").get().rt,
      '{"student":"A"}',
    );
    assert.equal(
      db.prepare("SELECT COUNT(*) AS n FROM xp_observations").get().n,
      0,
    );
    db.close();
    db = openStore(file);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM students").get().n, 1);
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
