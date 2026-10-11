import React, { useEffect, useRef, useState } from "react";
import { descriptions } from "./studio.jsx";
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function PersistentXP({
  students,
  events,
  busy,
  onAward,
  onUndo,
  attempts,
}) {
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState(null);
  const search = useRef(null),
    panel = useRef(null),
    origin = useRef(null);
  const selectedPerson = students.find((s) => s.id === selected);
  const total = (id) =>
    events
      .filter((e) => e.student === id && !e.reversedAt)
      .reduce((sum, e) => sum + e.value, 0);
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => origin.current?.focus());
  };
  useEffect(() => {
    if (selected) panel.current?.focus();
  }, [selected]);
  useEffect(() => {
    function keyboard(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
      }
      if (e.key === "Escape" && selected && !busy) {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [selected, busy]);
  const visible = students.filter((s) =>
    normalize(query)
      .split(/\s+/)
      .every((token) => normalize(`${s.name} ${s.alias}`).includes(token)),
  );
  async function award(category, value) {
    const key = `${selected}-${category}-${value}`;
    if (!attempts.current.has(key))
      attempts.current.set(key, crypto.randomUUID());
    const ok = await onAward({
      student: selected,
      category,
      value,
      requestId: attempts.current.get(key),
    });
    if (ok) attempts.current.delete(key);
  }
  return (
    <>
      <div className="desk persistent-desk">
        <section className="roster" aria-label="Alumnado del grupo">
          <div className="roster-toolbar">
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                ref={search}
                type="search"
                aria-label="Buscar alumno por nombre o alias"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o alias…"
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
            <span>Orden por apellidos · sin rankings</span>
          </div>
          <div className="student-list">
            {visible.map((s, i) => (
              <button
                className={`student-row ${selected === s.id ? "selected" : ""}`}
                key={s.id}
                disabled={busy}
                aria-label={`Abrir ficha de ${s.name}`}
                aria-pressed={selected === s.id}
                onClick={(e) => {
                  origin.current = e.currentTarget;
                  setSelected(s.id);
                }}
              >
                <span className={`avatar color-${i % 5}`} aria-hidden="true">
                  {s.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="student-identity">
                  <strong>{s.name}</strong>
                  <small>{s.alias}</small>
                </span>
                <span className="student-observation">
                  {total(s.id)} XP base
                </span>
                <span className="row-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
          {!visible.length && (
            <p className="info-banner">
              No encontramos ese alumno. Prueba otro nombre o alias.
            </p>
          )}
        </section>
        <aside
          ref={panel}
          tabIndex={-1}
          className={`quick-panel ${selectedPerson ? "is-open" : ""}`}
          aria-label="Panel rápido de alumno"
        >
          {selectedPerson ? (
            <>
              <div className="panel-top">
                <span className="eyebrow">FICHA PRIVADA</span>
                <button
                  disabled={busy}
                  onClick={close}
                  aria-label="Cerrar ficha"
                >
                  Cerrar ×
                </button>
              </div>
              <h2>{selectedPerson.name}</h2>
              <p className="alias">{selectedPerson.alias}</p>
              <div className="xp-summary">
                <strong data-testid="xp-total">{total(selected)}</strong>
                <div>
                  XP base observado<small>Evidencia, no nota oficial</small>
                </div>
              </div>
              <div className="action-heading">
                <h3>Registrar observación</h3>
                <p>Observación positiva · sin bonus de especialidad.</p>
              </div>
              <div className="actions" aria-busy={busy}>
                {Object.entries(descriptions).map(([category, descriptor]) => (
                  <div className="category" key={category}>
                    <strong>{category}</strong>
                    <div className="persistent-xp-values">
                      {[1, 2, 3].map((value) => (
                        <button
                          key={value}
                          disabled={busy}
                          aria-label={`${category}: registrar ${value} XP base`}
                          onClick={() => award(category, value)}
                        >
                          <strong>+{value}</strong>
                          <span>{descriptor[value]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="panel-help">
                Guardar una observación no modifica notas, RT ni comportamiento.
                Sin comentario obligatorio.
              </p>
            </>
          ) : (
            <>
              <h2>Elige un alumno</h2>
              <p>Su ficha y las acciones rápidas aparecerán aquí.</p>
            </>
          )}
        </aside>
      </div>
      <section className="xp-history" aria-label="Historial privado de XP">
        <h2>Observaciones y correcciones</h2>
        {!events.length && <p>Aún no hay observaciones en este grupo.</p>}
        {events.map((e) => (
          <article key={e.id} className="xp-history-entry">
            <div>
              <strong>{students.find((s) => s.id === e.student)?.name}</strong>
              <p>
                {e.category} · +{e.value} XP base ·{" "}
                {e.reversedAt ? "Deshecho" : "Registrado"}
              </p>
              <small>
                {new Date(e.time).toLocaleString("es-ES")} · Docente:{" "}
                {e.teacher}
              </small>
              {e.reversedAt && (
                <p className="fine-print">
                  Corrección: {new Date(e.reversedAt).toLocaleString("es-ES")} ·{" "}
                  {e.reversedBy}. La observación original se conserva.
                </p>
              )}
            </div>
            {!e.reversedAt && (
              <button
                className="outline-button"
                disabled={busy}
                aria-label={`Deshacer ${e.category} de ${students.find((s) => s.id === e.student)?.name}: ${e.value} XP`}
                onClick={() => onUndo(e.id)}
              >
                Deshacer
              </button>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
