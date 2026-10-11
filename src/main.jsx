import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { PersistentAtlas } from "./persistent.jsx";
import { DesignGallery } from "./designs.jsx";
import { Studio, Navigation, SessionControl, descriptions } from "./studio.jsx";

const categories = ["Comunicación", "Precisión", "Constancia", "Colaboración"];
const names = [
  "Alba",
  "Bruno",
  "Carla",
  "Daniel",
  "Elena",
  "Fabio",
  "Gabriela",
  "Hugo",
  "Inés",
  "Javier",
  "Lara",
  "Marcos",
  "Nora",
  "Óscar",
  "Paula",
  "Raúl",
  "Sara",
  "Tomás",
  "Valeria",
  "Álex",
  "Beatriz",
  "César",
  "Diana",
  "Eric",
  "Flora",
  "Gonzalo",
  "Helena",
  "Iván",
  "Julia",
  "Leo",
];
const surnames = ["Martín", "Soler", "Vega", "Gil", "Ramos"];
const groups = [
  { id: "a", name: "1.º ESO · A", subject: "Francés · Grupo demo" },
  { id: "b", name: "1.º ESO · B", subject: "Francés · Grupo demo" },
];
const students = groups.flatMap((group, g) =>
  names.map((name, i) => ({
    id: `${group.id}-${i}`,
    group: group.id,
    name: `${names[(i + g * 5) % 30]} ${surnames[i % 5]}`,
    alias: `Éclipse ${String(i + 1).padStart(2, "0")}`,
    color: i % 5,
  })),
);
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");
const wait = () => new Promise((resolve) => setTimeout(resolve, 500));

function App() {
  const [view, setView] = useState("class");
  const [sessions, setSessions] = useState({});
  function toggleSession() {
    setSessions((previous) => ({
      ...previous,
      [group]: previous[group]?.active
        ? {
            ...previous[group],
            active: false,
            endedAt: new Date().toISOString(),
          }
        : { active: true, startedAt: new Date().toISOString() },
    }));
  }

  const [signedIn, setSignedIn] = useState(false),
    [group, setGroup] = useState("a"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(null),
    [events, setEvents] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [feedback, setFeedback] = useState(null),
    [failNext, setFailNext] = useState(false),
    [tools, setTools] = useState(false);
  const search = useRef(null),
    origin = useRef(null),
    panel = useRef(null),
    busyRef = useRef(false);
  const activeGroup = groups.find((item) => item.id === group);
  const roster = students.filter((student) => student.group === group);
  const visible = roster.filter((student) =>
    normalize(query)
      .split(/\s+/)
      .every((token) =>
        normalize(`${student.name} ${student.alias}`).includes(token),
      ),
  );
  const total = (studentId) =>
    events
      .filter((event) => event.student === studentId && !event.reversed)
      .reduce((sum, event) => sum + event.value, 0);
  const activeEvents = events.filter(
    (event) => event.group === group && !event.reversed,
  );
  function close() {
    setSelected(null);
    setError("");
    requestAnimationFrame(() => origin.current?.focus());
  }
  useEffect(() => {
    if (selected) panel.current?.focus();
  }, [selected?.id]);
  useEffect(() => {
    function keyboard(event) {
      if (event.key === "Escape" && !busyRef.current && selected) {
        event.preventDefault();
        close();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [selected]);
  async function award(category, value) {
    if (busyRef.current || !selected) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setFeedback(null);
    const target = selected,
      simulateFailure = failNext;
    setFailNext(false);
    await wait();
    if (simulateFailure) {
      setError(
        "No se ha registrado el XP. Puedes volver a pulsar la acción para reintentar.",
      );
    } else {
      const event = {
        id: crypto.randomUUID(),
        student: target.id,
        name: target.name,
        group: target.group,
        category,
        value,
        reversed: false,
      };
      setEvents((previous) => [...previous, event]);
      setFeedback({
        event,
        message: `+${value} XP base · ${target.name} · ${category}`,
      });
    }
    busyRef.current = false;
    setBusy(false);
  }
  async function undo(event) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    await wait();
    setEvents((previous) =>
      previous.map((item) =>
        item.id === event.id ? { ...item, reversed: true } : item,
      ),
    );
    setFeedback({
      message: `Registro deshecho · ${event.name}. La corrección queda en el historial demo.`,
    });
    busyRef.current = false;
    setBusy(false);
  }
  function changeGroup(value) {
    if (busyRef.current) return;
    setGroup(value);
    setSelected(null);
    setQuery("");
    setError("");
    setFeedback(null);
  }
  if (!signedIn)
    return (
      <main className="login">
        <section className="login-story">
          <div className="brand">
            <span className="brand-mark">◐</span> EclipseGames <small>V2</small>
          </div>
          <p className="eyebrow">MESA DOCENTE</p>
          <h1>
            Más tiempo para
            <br />
            dar clase.
          </h1>
          <p>
            Observa, registra y vuelve al grupo.
            <br />
            Todo lo importante, a mano.
          </p>
          <div className="story-lines">
            <span>01 &nbsp; Encuentra al alumno</span>
            <span>02 &nbsp; Registra una observación</span>
            <span>03 &nbsp; Sigue dando clase</span>
          </div>
          <p className="story-foot">
            La evidencia acompaña tu juicio. No lo sustituye.
          </p>
        </section>
        <section className="login-form">
          <span className="demo-tag">PROTOTIPO · DATOS FICTICIOS</span>
          <h2>Tu clase empieza aquí</h2>
          <p>Explora la mesa docente con dos grupos de demostración.</p>
          <div className="teacher-profile">
            <div className="avatar">MD</div>
            <div>
              <strong>María · Docente demo</strong>
              <small>Francés · Educación secundaria</small>
            </div>
          </div>
          <button className="primary" onClick={() => setSignedIn(true)}>
            Entrar a la demo <span aria-hidden="true">→</span>
          </button>
          <p className="fine-print">
            Acceso simulado, sin contraseña. Los registros viven en memoria y se
            reinician al recargar. No introduzcas datos reales.
          </p>
        </section>
      </main>
    );
  return (
    <div className={`app ${view === "classroom" ? "is-projecting" : ""}`}>
      <aside className="rail">
        <div className="brand">
          <span className="brand-mark">◐</span>
          <span>
            EclipseGames<small>Mesa docente</small>
          </span>
        </div>
        <div className="rail-section">TU ESPACIO</div>
        <Navigation view={view} onChange={setView} disabled={busy} />
        <div className="rail-note">
          Una acción.
          <br />Y de vuelta a la clase.
        </div>
        <div className="rail-bottom">
          <span className="private-dot" /> Espacio privado docente
          <br />
          <button
            disabled={busy}
            onClick={() => {
              setSignedIn(false);
              setView("class");
              setSessions({});
              setFailNext(false);
              setTools(false);
              setSelected(null);
              setEvents([]);
              setFeedback(null);
              setError("");
              setQuery("");
            }}
          >
            Salir de la demo
          </button>
        </div>
      </aside>
      <main className="workspace" hidden={view !== "class"}>
        <header className="topbar">
          <span>CURSO DEMO · 2026 / 27</span>
          <span className="demo-tag">DATOS FICTICIOS</span>
        </header>
        <Navigation view={view} onChange={setView} disabled={busy} mobile />
        <section className="heading">
          <div>
            <p className="eyebrow">EN CLASE</p>
            <h1>Tu grupo, a mano.</h1>
            <p>Encuentra a un alumno y registra lo que has observado.</p>
          </div>
          <label className="group-picker">
            Grupo activo
            <select
              aria-label="Grupo activo"
              value={group}
              disabled={busy}
              onChange={(event) => changeGroup(event.target.value)}
            >
              {groups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </section>
        <SessionControl session={sessions[group]} onToggle={toggleSession} />
        <section className="session-strip">
          <div>
            <span className="live-dot" />
            <strong>{activeGroup.name}</strong>
            <span>{activeGroup.subject}</span>
          </div>
          <div>
            <strong>{roster.length}</strong> alumnos{" "}
            <span className="strip-divider">/</span>{" "}
            <strong>{activeEvents.length}</strong> observaciones demo
          </div>
        </section>
        <div className="desk">
          <section className="roster">
            <div className="roster-toolbar">
              <label className="search">
                <span aria-hidden="true">⌕</span>
                <input
                  ref={search}
                  type="search"
                  aria-label="Buscar alumno"
                  placeholder="Buscar por nombre o alias…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <kbd>Ctrl K</kbd>
              </label>
              {query && (
                <button
                  className="text-button"
                  onClick={() => {
                    setQuery("");
                    search.current?.focus();
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="list-heading">
              <h2>
                Alumnado <span>{visible.length}</span>
              </h2>
              <span>Orden de lista · sin rankings</span>
            </div>
            <div className="student-list">
              {visible.map((student) => (
                <button
                  className={`student-row ${selected?.id === student.id ? "selected" : ""}`}
                  key={student.id}
                  disabled={busy}
                  aria-label={`Abrir ficha de ${student.name}`}
                  aria-pressed={selected?.id === student.id}
                  onClick={(event) => {
                    origin.current = event.currentTarget;
                    setSelected(student);
                    setError("");
                  }}
                >
                  <span className={`avatar color-${student.color}`}>
                    {initials(student.name)}
                  </span>
                  <span className="student-identity">
                    <strong>{student.name}</strong>
                    <small>{student.alias}</small>
                  </span>
                  <span className="student-observation">
                    {total(student.id) > 0
                      ? `${total(student.id)} XP base`
                      : "Sin registro"}
                  </span>
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
            {!visible.length && (
              <div className="empty-search">
                <h3>No encontramos ese alumno</h3>
                <p>Prueba su nombre o alias en el grupo activo.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    search.current?.focus();
                  }}
                >
                  Ver todo el grupo
                </button>
              </div>
            )}
          </section>
          <aside
            className={`quick-panel ${selected ? "is-open" : ""}`}
            aria-label="Panel rápido de alumno"
            ref={panel}
            tabIndex={-1}
          >
            {selected ? (
              <>
                <div className="panel-top">
                  <span className="eyebrow">FICHA PRIVADA</span>
                  <button
                    disabled={busy}
                    onClick={close}
                    aria-label="Cerrar ficha"
                  >
                    Cerrar <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className={`avatar portrait color-${selected.color}`}>
                  {initials(selected.name)}
                </div>
                <h2>{selected.name}</h2>
                <p className="alias">
                  {selected.alias} · {activeGroup.name}
                </p>
                <div className="xp-summary">
                  <strong>{total(selected.id)}</strong>
                  <div>
                    XP base observado<small>Evidencia, no nota oficial</small>
                  </div>
                </div>
                <div className="action-heading">
                  <h3>Registrar observación</h3>
                  <p>Categoría y valor explícitos. Sin bonus.</p>
                </div>
                <div className="actions" aria-busy={busy}>
                  {categories.map((category, i) => (
                    <div className="category" key={category}>
                      <div>
                        <span
                          className={`category-symbol symbol-${i}`}
                          aria-hidden="true"
                        >
                          {["◌", "◇", "↗", "⊞"][i]}
                        </span>
                        <strong>{category}</strong>
                      </div>
                      <div className="values">
                        {[1, 2, 3].map((value) => (
                          <button
                            key={value}
                            disabled={busy}
                            title={descriptions[category][value]}
                            aria-label={`${category}: registrar ${value} XP base`}
                            onClick={() => award(category, value)}
                          >
                            +{value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {busy && (
                  <p className="pending" role="status">
                    Guardando el cambio demo…
                  </p>
                )}
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <p className="panel-help">
                  Registra una evidencia positiva. Puedes deshacer el registro.
                </p>
                <div className="history">
                  <h3>Actividad de este alumno</h3>
                  {events.filter((event) => event.student === selected.id)
                    .length === 0 ? (
                    <p>La primera observación empieza aquí.</p>
                  ) : (
                    <ul>
                      {events
                        .filter((event) => event.student === selected.id)
                        .slice()
                        .reverse()
                        .map((event) => (
                          <li key={event.id}>
                            <span>
                              {event.category}
                              <small>
                                {event.reversed
                                  ? "Corregido · registro deshecho"
                                  : "Observación demo"}
                              </small>
                            </span>
                            <strong>
                              {event.reversed ? "Anulado" : `+${event.value}`}
                            </strong>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="panel-empty">
                <span className="empty-art" aria-hidden="true">
                  ◌
                </span>
                <p className="eyebrow">EL SIGUIENTE PASO</p>
                <h2>
                  Una observación
                  <br />
                  empieza con alguien.
                </h2>
                <p>
                  Selecciona un alumno para registrar XP y consultar su
                  actividad demo.
                </p>
                <div className="privacy-note">
                  Solo tú ves esta información.
                </div>
              </div>
            )}
          </aside>
        </div>
        <footer className="workspace-footer">
          <span>
            XP base únicamente · sin notas, bonus ni efectos sobre otros
            dominios
          </span>
          <button
            className="text-button"
            onClick={() => setTools(!tools)}
            aria-expanded={tools}
          >
            Herramientas de prueba
          </button>
        </footer>
        {tools && (
          <div className="demo-tools">
            <label>
              <input
                type="checkbox"
                checked={failNext}
                disabled={busy}
                onChange={(event) => setFailNext(event.target.checked)}
              />{" "}
              Simular error en el próximo registro XP
            </label>
            <span>Comprueba que no se suma XP y que puedes reintentar.</span>
          </div>
        )}
      </main>
      <Studio
        view={view}
        setView={setView}
        group={group}
        setGroup={changeGroup}
        groups={groups}
        students={roster}
        events={events}
        sessions={sessions}
        toggleSession={toggleSession}
      />
      {feedback && view === "class" && (
        <div className="toast" role="status">
          <span className="toast-icon" aria-hidden="true">
            ✓
          </span>
          <span>{feedback.message}</span>
          {feedback.event &&
            !events.find((event) => event.id === feedback.event.id)
              ?.reversed && (
              <button disabled={busy} onClick={() => undo(feedback.event)}>
                Deshacer
              </button>
            )}
          <button
            className="toast-close"
            disabled={busy}
            aria-label="Cerrar aviso"
            onClick={() => setFeedback(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  new URLSearchParams(location.search).has("design") ||
    new URLSearchParams(location.search).has("gallery") ||
    location.protocol === "file:" ? (
    <DesignGallery>
      <App />
    </DesignGallery>
  ) : (
    <PersistentAtlas />
  ),
);
