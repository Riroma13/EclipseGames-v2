import React, { useEffect, useRef, useState } from "react";
import { PersistentXP } from "./persistent-xp.jsx";
import { SessionControl } from "./studio.jsx";
import "./persistent.css";
async function request(path, body) {
  let response, value;
  try {
    response = await fetch(`/api/${path}`, {
      credentials: "same-origin",
      ...(body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    value = await response.json();
  } catch {
    throw new Error(
      "No se pudo confirmar el cambio. Comprueba la conexión y pulsa la misma acción para reintentar.",
    );
  }
  if (!response.ok) {
    const error = new Error(
      value.error || "No se pudo completar la operación.",
    );
    error.status = response.status;
    throw error;
  }
  return value;
}
export function PersistentAtlas() {
  const [ready, setReady] = useState(false),
    [teacher, setTeacher] = useState(null),
    [groups, setGroups] = useState([]),
    [data, setData] = useState(null),
    [view, setView] = useState("class"),
    [draft, setDraft] = useState({}),
    [sessionId, setSessionId] = useState(""),
    [search, setSearch] = useState(""),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [newGroup, setNewGroup] = useState(""),
    [newRoster, setNewRoster] = useState("");
  const lock = useRef(false),
    xpAttempts = useRef(new Map());
  useEffect(() => {
    document.documentElement.dataset.design = "atlas";
    document.title = "EclipseGames · Atlas de clase";
    request("me")
      .then(async (me) => {
        setGroups(await request("groups"));
        setTeacher(me);
      })
      .catch((e) => {
        if (e.status !== 401)
          setError(
            "No se puede conectar con el servidor. Comprueba que la API esté iniciada.",
          );
      })
      .finally(() => setReady(true));
  }, []);
  const session =
    data?.sessions.find((s) => s.id === sessionId) || data?.sessions[0];
  const dirty = JSON.stringify(draft) !== JSON.stringify(session?.rt || {});
  const accept = (value) => {
    setData(value);
    setSessionId(value.sessions[0]?.id || "");
    setDraft(value.sessions[0]?.rt || {});
    setSearch("");
  };
  async function run(action) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      await action();
      return true;
    } catch (e) {
      setError(e.message);
      if (e.status === 401 && teacher) {
        setTeacher(null);
        setData(null);
        setDraft({});
      }
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const discard = () =>
    !dirty ||
    window.confirm("Hay cambios RT sin guardar. ¿Quieres descartarlos?");
  function logout() {
    if (discard())
      run(async () => {
        await request("logout", {});
        setTeacher(null);
        setData(null);
        setDraft({});
        setSessionId("");
        setView("class");
        xpAttempts.current.clear();
      });
  }
  if (!ready)
    return (
      <main className="login">
        <p role="status">Cargando espacio docente…</p>
      </main>
    );
  if (!teacher)
    return (
      <main className="login">
        <section className="login-story">
          <div className="brand">◐ EclipseGames</div>
          <p className="eyebrow">ATLAS DE CLASE</p>
          <h1>
            Tu clase,
            <br />a mano.
          </h1>
          <p>Grupos, sesiones y tareas en un espacio docente privado.</p>
        </section>
        <section className="login-form">
          <h2>Acceso docente</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const me = await request("login", { email, password });
                setGroups(await request("groups"));
                setTeacher(me);
                setPassword("");
              });
            }}
          >
            <label className="field">
              Correo
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              Contraseña
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="primary" disabled={busy}>
              Entrar
            </button>
          </form>
          {error && <p role="alert">{error}</p>}
          <p className="fine-print">
            Acceso exclusivo para docentes. No hay cuentas de alumnado.
          </p>
          <a href="?design=atlas">Explorar demo Atlas con datos ficticios</a>
        </section>
      </main>
    );
  const sorted = [...(data?.students || [])].sort((a, b) => {
    const key = (s) =>
      s.name.split(" ").slice(1).join(" ") + " " + s.name.split(" ")[0];
    return key(a).localeCompare(key(b), "es");
  });
  const normalize = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const evaluated = Object.values(draft).filter((v) =>
    ["10", "5", "0"].includes(v),
  );
  return (
    <div className="app persistent-atlas">
      <aside className="rail">
        <div className="brand">
          ◐ EclipseGames<small>Atlas de clase</small>
        </div>
        <p>ESPACIO DOCENTE</p>
        <nav className="studio-nav" aria-label="Secciones persistentes">
          <button
            disabled={busy}
            className={view === "class" ? "active" : ""}
            onClick={() => {
              setView("class");
              xpAttempts.current.clear();
              setStatus("");
            }}
          >
            En clase · XP
          </button>
          <button
            disabled={busy}
            className={view === "rt" ? "active" : ""}
            onClick={() => {
              setView("rt");
              setStatus("");
            }}
          >
            Tareas · RT
          </button>
        </nav>
        <div className="rail-bottom">
          <small>{teacher.email}</small>
          <button disabled={busy} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <span>ATLAS DE CLASE</span>
          <button className="tablet-logout" disabled={busy} onClick={logout}>
            Cerrar sesión
          </button>
          <span className="demo-tag">
            XP, SESIONES Y RT · GUARDADO PERSISTENTE
          </span>
        </header>
        <section className="heading">
          <div>
            <p className="eyebrow">EN CLASE</p>
            <h1>Tu grupo, a mano.</h1>
            <p>Encuentra un alumno y registra lo que has observado.</p>
          </div>
          <label className="group-picker">
            Grupo activo
            <select
              aria-label="Grupo activo"
              disabled={busy}
              value={data?.group.id || ""}
              onChange={(e) => {
                const id = e.target.value;
                if (discard())
                  run(async () => accept(await request(`groups/${id}`)));
              }}
            >
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
        </section>
        <nav className="persistent-tabs" aria-label="Cambiar sección">
          <button
            className={view === "class" ? "solid-button" : "outline-button"}
            disabled={busy}
            aria-pressed={view === "class"}
            onClick={() => {
              setView("class");
              xpAttempts.current.clear();
              setStatus("");
            }}
          >
            En clase · XP
          </button>
          <button
            className={view === "rt" ? "solid-button" : "outline-button"}
            disabled={busy}
            aria-pressed={view === "rt"}
            onClick={() => {
              setView("rt");
              setStatus("");
            }}
          >
            Tareas · RT
          </button>
        </nav>
        {error && (
          <div role="alert" className="info-banner">
            {error}{" "}
            {data && (
              <button
                disabled={busy}
                onClick={() => {
                  if (discard())
                    run(async () =>
                      accept(await request(`groups/${data.group.id}`)),
                    );
                }}
              >
                Actualizar registros
              </button>
            )}
          </div>
        )}
        {status && (
          <p role="status" className="info-banner">
            {status}
          </p>
        )}
        <details className="info-banner">
          <summary>Crear grupo</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (discard())
                run(async () => {
                  const created = await request("groups", {
                    name: newGroup,
                    students: newRoster
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  });
                  setGroups(await request("groups"));
                  accept(await request(`groups/${created.id}`));
                  setNewGroup("");
                  setNewRoster("");
                  setStatus("Grupo creado.");
                });
            }}
          >
            <label className="field">
              Nombre del grupo
              <input
                required
                maxLength={100}
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
              />
            </label>
            <label className="field">
              Alumnos · un nombre completo por línea
              <textarea
                required
                rows={6}
                value={newRoster}
                onChange={(e) => setNewRoster(e.target.value)}
              />
            </label>
            <button className="solid-button" disabled={busy}>
              Crear grupo y alumnos
            </button>
          </form>
          <p className="fine-print">
            Lista privada para la docente. Se asignan alias automáticamente.
          </p>
        </details>
        {!data && (
          <p className="info-banner">
            {groups.length
              ? "Selecciona un grupo para empezar."
              : "No hay grupos asignados. Crea tu primer grupo."}
          </p>
        )}
        {data && (
          <>
            <fieldset disabled={busy} className="operation-controls">
              <SessionControl
                session={
                  data.sessions.find((s) => s.active) || data.sessions[0]
                }
                onToggle={() => {
                  const active = data.sessions.find((s) => s.active);
                  if (
                    active &&
                    dirty &&
                    !window.confirm(
                      "Hay RT sin guardar. ¿Finalizar descartando esos cambios?",
                    )
                  )
                    return;
                  run(async () => {
                    accept(
                      await request(
                        `groups/${data.group.id}/${active ? "end" : "start"}`,
                        active
                          ? { session: active.id, version: active.version }
                          : {},
                      ),
                    );
                    setStatus(
                      active ? "Sesión finalizada." : "Sesión iniciada.",
                    );
                  });
                }}
              />
            </fieldset>
            {view === "class" && (
              <PersistentXP
                key={data.group.id}
                attempts={xpAttempts}
                students={sorted}
                events={data.xpEvents || []}
                busy={busy}
                onAward={(body) =>
                  run(async () => {
                    const result = await request(
                      `groups/${data.group.id}/xp`,
                      body,
                    );
                    setData((previous) => ({
                      ...previous,
                      xpEvents: result.xpEvents,
                    }));
                    setStatus(
                      `+${body.value} XP base guardado · ${data.students.find((s) => s.id === body.student)?.name} · ${body.category}.`,
                    );
                  })
                }
                onUndo={(event) =>
                  run(async () => {
                    const result = await request(
                      `groups/${data.group.id}/xp-undo`,
                      { event },
                    );
                    setData((previous) => ({
                      ...previous,
                      xpEvents: result.xpEvents,
                    }));
                    setStatus(
                      "Observación deshecha. La corrección queda en el historial XP.",
                    );
                  })
                }
              />
            )}
            {view === "rt" && (
              <>
                <label className="field">
                  Sesión consultada
                  <select
                    aria-label="Sesión consultada"
                    disabled={busy}
                    value={session?.id || ""}
                    onChange={(e) => {
                      if (discard()) {
                        const s = data.sessions.find(
                          (s) => s.id === e.target.value,
                        );
                        setSessionId(s.id);
                        setDraft(s.rt);
                        setStatus("");
                      }
                    }}
                  >
                    {!session && <option value="">Sin sesiones</option>}
                    {data.sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {new Date(s.startedAt).toLocaleString("es-ES")} ·{" "}
                        {s.active ? "En curso" : "Finalizada"}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="module-toolbar">
                  <label className="field">
                    Buscar alumno
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Apellidos o nombre…"
                    />
                  </label>
                  <button
                    className="outline-button"
                    disabled={busy || !session?.active}
                    onClick={() => {
                      setDraft(
                        Object.fromEntries(
                          data.students.map((s) => [s.id, "10"]),
                        ),
                      );
                      setStatus("");
                    }}
                  >
                    Asignar 10 a todos
                  </button>
                  <button
                    className="solid-button"
                    disabled={busy || !session?.active || !dirty}
                    onClick={() =>
                      run(async () => {
                        accept(
                          await request(`groups/${data.group.id}/rt`, {
                            session: session.id,
                            version: session.version,
                            rt: draft,
                          }),
                        );
                        setStatus("RT guardado.");
                      })
                    }
                  >
                    Guardar RT
                  </button>
                  <button
                    className="outline-button"
                    disabled={
                      busy ||
                      !session?.active ||
                      dirty ||
                      session.history[0]?.kind !== "save"
                    }
                    onClick={() =>
                      run(async () => {
                        accept(
                          await request(`groups/${data.group.id}/undo`, {
                            session: session.id,
                            version: session.version,
                          }),
                        );
                        setStatus(
                          "Guardado deshecho. La corrección queda en el historial.",
                        );
                      })
                    }
                  >
                    Deshacer guardado
                  </button>
                </div>
                <p className="fine-print">
                  {dirty ? "Cambios sin guardar." : "Registros guardados."} ·
                  Media RT:{" "}
                  {evaluated.length
                    ? (
                        evaluated.reduce((sum, v) => sum + Number(v), 0) /
                        evaluated.length
                      ).toFixed(2)
                    : "Sin registros evaluados"}
                  . Ausente y No evaluado quedan fuera de la media.
                </p>
                {!session?.active && (
                  <p className="info-banner">
                    {session
                      ? "Sesión finalizada · solo lectura."
                      : "Comienza una sesión para registrar RT."}
                  </p>
                )}
                <div className="rt-table">
                  <div className="rt-table-head">
                    <span>Alumno · orden por apellidos</span>
                    <span>Registro</span>
                    <span>Estado</span>
                  </div>
                  {sorted
                    .filter((s) =>
                      normalize(s.name).includes(normalize(search)),
                    )
                    .map((s) => (
                      <div className="rt-table-row" key={s.id}>
                        <strong>{s.name}</strong>
                        <select
                          aria-label={`RT de ${s.name}`}
                          disabled={busy || !session?.active}
                          value={draft[s.id] || ""}
                          onChange={(e) => {
                            setDraft((prev) => ({
                              ...prev,
                              [s.id]: e.target.value,
                            }));
                            setStatus("");
                          }}
                        >
                          <option value="">No evaluado</option>
                          <option value="10">10</option>
                          <option value="5">5</option>
                          <option value="0">0</option>
                          <option value="A">A · Ausente</option>
                        </select>
                        <span>
                          {draft[s.id] === "A"
                            ? "Ausente"
                            : draft[s.id]
                              ? "Evaluado"
                              : "No evaluado"}
                        </span>
                      </div>
                    ))}
                </div>
                <details className="info-banner">
                  <summary>
                    Historial de guardados y correcciones ·{" "}
                    {session?.history.length || 0}
                  </summary>
                  {session?.history.map((h) => (
                    <p key={h.id}>
                      {new Date(h.time).toLocaleString("es-ES")} ·{" "}
                      {h.kind === "undo"
                        ? "Guardado deshecho"
                        : "Lote RT guardado"}{" "}
                      · {Object.keys(h.after).length} registros
                    </p>
                  ))}
                </details>
              </>
            )}
          </>
        )}
        <p className="fine-print">
          Avatares y arte provisionales. Evaluación, gemas y proyección siguen
          disponibles como demos independientes:{" "}
          <a
            href="?design=atlas"
            onClick={(e) => {
              if (!discard()) e.preventDefault();
            }}
          >
            abrir prototipo visual
          </a>
          .
        </p>
      </main>
    </div>
  );
}
