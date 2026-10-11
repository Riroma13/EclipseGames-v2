import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export function openStore(
  path = process.env.ECLIPSE_DB || "data/eclipse.sqlite",
) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS teachers(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,hash TEXT NOT NULL,salt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS groups(id TEXT PRIMARY KEY,teacher TEXT NOT NULL REFERENCES teachers(id),name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS students(id TEXT PRIMARY KEY,group_id TEXT NOT NULL REFERENCES groups(id),name TEXT NOT NULL,alias TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS logins(token TEXT PRIMARY KEY,teacher TEXT NOT NULL REFERENCES teachers(id),expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,group_id TEXT NOT NULL REFERENCES groups(id),startedAt TEXT NOT NULL,endedAt TEXT,version INTEGER NOT NULL DEFAULT 0,rt TEXT NOT NULL DEFAULT '{}');
    CREATE UNIQUE INDEX IF NOT EXISTS one_active ON sessions(group_id) WHERE endedAt IS NULL;
    CREATE TABLE IF NOT EXISTS rt_history(id TEXT PRIMARY KEY,session TEXT NOT NULL REFERENCES sessions(id),teacher TEXT NOT NULL REFERENCES teachers(id),time TEXT NOT NULL,before TEXT NOT NULL,after TEXT NOT NULL,kind TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS xp_observations(
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      group_id TEXT NOT NULL REFERENCES groups(id),
      student TEXT NOT NULL REFERENCES students(id),
      teacher TEXT NOT NULL REFERENCES teachers(id),
      time TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Comunicación','Precisión','Constancia','Colaboración')),
      value INTEGER NOT NULL CHECK(value IN (1,2,3)),
      UNIQUE(teacher,request_id)
    );
    CREATE INDEX IF NOT EXISTS xp_by_group ON xp_observations(group_id);
    CREATE TABLE IF NOT EXISTS xp_reversals(
      observation TEXT PRIMARY KEY REFERENCES xp_observations(id),
      teacher TEXT NOT NULL REFERENCES teachers(id),
      time TEXT NOT NULL
    );`);
  return db;
}
