import React, { useEffect, useRef, useState } from "react";
import "./studio.css";

export const descriptions = {
  Comunicación: [
    "No participa habitualmente, incluso cuando se le da la oportunidad o apoyo; evita intervenir y apenas intenta utilizar el francés.",
    "Participación en español.",
    "Francés con ayuda o frase breve.",
    "Francés espontáneo o elaborado.",
  ],
  Precisión: [
    "Trabajo frecuentemente incompleto o descuidado; no revisa ni corrige pese a las indicaciones.",
    "Corrige un error o mejora.",
    "Trabajo correcto y cuidado.",
    "Trabajo especialmente preciso.",
  ],
  Constancia: [
    "No inicia el trabajo o lo abandona con facilidad; necesita recordatorios continuos y muestra escasa perseverancia.",
    "Lo intenta pese a la dificultad.",
    "Mantiene el esfuerzo.",
    "Supera una dificultad o muestra una mejora clara.",
  ],
  Colaboración: [
    "Evita colaborar cuando se requiere, se desentiende del trabajo común o dificulta el funcionamiento del grupo.",
    "Ayuda puntual adecuada.",
    "Colaboración activa.",
    "Ayuda especialmente valiosa.",
  ],
};
const pages = [
  ["class", "En clase", "▦"],
  ["rt", "Tareas · RT", "▤"],
  ["evaluation", "Evaluación", "◇"],
  ["avatars", "Avatares y gemas", "◉"],
  ["broadcasts", "Retransmisiones", "◌"],
  ["organization", "Organización", "⊞"],
  ["history", "Historial privado", "↶"],
  ["behaviour", "Comportamiento", "◈"],
  ["settings", "Configuración", "⚙"],
  ["classroom", "Modo Aula", "↗"],
];
const titles = {
  rt: [
    "TAREAS",
    "El trabajo de hoy.",
    "Una lista clara. Una decisión por alumno.",
  ],
  evaluation: [
    "EVALUACIÓN",
    "Tu criterio, por delante.",
    "Rúbrica de observación · selección y cierre docente.",
  ],
  avatars: [
    "AGENTS ÉCLIPSE",
    "Una identidad que evoluciona.",
    "Personalización opcional. Progreso sin depender de dispositivos.",
  ],
  broadcasts: [
    "PROTOCOLE ÉCLIPSE",
    "La isla tiene algo que contar.",
    "Nueve Retransmisiones. Un misterio compartido.",
  ],
  organization: [
    "ORGANIZACIÓN",
    "Dale otra forma al grupo.",
    "Ruleta y equipos aleatorios, sin ordenar por rendimiento.",
  ],
  history: [
    "SEGUIMIENTO",
    "Cada cambio deja huella.",
    "Historial privado de observaciones y operaciones demo.",
  ],
  behaviour: [
    "COMPORTAMIENTO",
    "Acompañar, con contexto.",
    "Registro privado independiente de XP, RT y evaluación.",
  ],
  settings: [
    "CONFIGURACIÓN",
    "Prepara tu espacio.",
    "Grupo, contenidos y sesiones temporales de demostración.",
  ],
};
export function Navigation({ view, onChange, disabled, mobile = false }) {
  if (mobile)
    return (
      <nav className="mobile-sections" aria-label="Secciones en tablet">
        <select
          aria-label="Cambiar sección"
          value={view}
          onChange={(e) => onChange(e.target.value)}
        >
          {pages.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </nav>
    );
  return (
    <nav className="studio-nav" aria-label="Secciones">
      {pages.map(([id, label, icon]) => (
        <button
          key={id}
          disabled={disabled}
          className={view === id ? "active" : ""}
          aria-current={view === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
export function SessionControl({ session, onToggle }) {
  return (
    <div className="session-control">
      <div>
        <span
          className={session?.active ? "status-light on" : "status-light"}
        />
        <strong>
          {session?.active
            ? "Sesión en curso"
            : session?.endedAt
              ? "Sesión finalizada"
              : "Sin sesión activa"}
        </strong>
        <small>
          {session?.active
            ? `Inicio ${new Date(session.startedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
            : "Comienza cuando lo necesites · sin horarios"}
        </small>
      </div>
      <button className="solid-button" onClick={onToggle}>
        {session?.active ? "Finalizar sesión" : "Comenzar sesión"}
      </button>
    </div>
  );
}
function Lock({ open = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="3" />
      <path d={open ? "M8 10V6a4 4 0 018-1" : "M8 10V6a4 4 0 018 0v4"} />
      <path d="M12 14v3" />
    </svg>
  );
}
export function Gem({ type = "emerald" }) {
  return (
    <svg className={`gem gem-${type}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 4h16l6 9-14 17L2 13Z" fill="currentColor" />
      <path
        d="m8 4 4 9h8l4-9M2 13h28M12 13l4 17 4-17"
        fill="none"
        stroke="white"
        opacity=".55"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function Agent({ index = 0, size = "", equipped = "" }) {
  const skins = ["#c28b67", "#efc5a0", "#975e45", "#d8a178", "#f3d1b0"];
  const hair = ["#342b2a", "#674334", "#2f2423", "#a87939", "#2b2928"];
  return (
    <svg
      className={`agent ${size}`}
      viewBox="0 0 100 110"
      role="img"
      aria-label="Avatar ilustrado Agent Éclipse, maqueta"
    >
      <defs>
        <linearGradient id={`bg${index}`} x2="1" y2="1">
          <stop stopColor="#284b60" />
          <stop offset="1" stopColor="#172b39" />
        </linearGradient>
      </defs>
      <rect width="100" height="110" rx="22" fill={`url(#bg${index})`} />
      <circle cx="78" cy="22" r="20" fill="#88bda0" opacity=".13" />
      <path
        d="M13 110v-13q4-27 37-27t37 27v13"
        fill={equipped === "jacket" ? "#976c40" : "#345864"}
      />
      <path d="m35 76 15 21 15-21-9-5H44Z" fill="#e9eee4" />
      <path d="m47 84 6 0 2 17-5 8-5-8Z" fill="#e1a548" />
      <rect
        x="43"
        y="59"
        width="14"
        height="20"
        rx="5"
        fill={skins[index % 5]}
      />
      <ellipse cx="50" cy="42" rx="24" ry="28" fill={skins[index % 5]} />
      <path
        d={
          index % 2
            ? "M25 47V26q8-22 30-15 24 5 21 34l-7-20q-21 8-37 0Z"
            : "M25 37q-6-29 24-29 29-2 28 28l-8-10q-18 8-27-3L30 42Z"
        }
        fill={hair[index % 5]}
      />
      <ellipse cx="40" cy="43" rx="3.1" ry="4" fill="#25302d" />
      <ellipse cx="61" cy="43" rx="3.1" ry="4" fill="#25302d" />
      <circle cx="41" cy="42" r=".9" fill="white" />
      <circle cx="62" cy="42" r=".9" fill="white" />
      <path
        d="M44 57q7 5 13-1"
        fill="none"
        stroke="#844f43"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M49 46v6h4" stroke="#ab7253" fill="none" />
      <path d="M25 90v20m50-20v20" stroke="#83a8a5" opacity=".4" />
      <circle cx="70" cy="89" r="5" fill="#bfcda7" />
      <path d="M68 89h4m-2-2v4" stroke="#3c6153" />
      {equipped === "radio" && (
        <>
          <rect x="20" y="83" width="11" height="17" rx="2" fill="#182c32" />
          <path d="M24 84v-9" stroke="#d8c899" />
          <circle cx="25" cy="88" r="2" fill="#c4a354" />
        </>
      )}
    </svg>
  );
}
function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const origin = document.activeElement;
    ref.current?.focus();
    function handle(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const all = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled),input,select,textarea,[tabindex="0"]',
          ),
        ];
        const first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      origin?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="studio-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar ventana">
            Cerrar ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
const levels = ["Insuficiente", "En desarrollo", "Adecuado", "Excelente"];
const broadcasts = [
  "El apagón",
  "Una señal entre las rocas",
  "El mensaje de Archives",
  "El laboratorio",
  "La frecuencia perdida",
  "En el muelle",
  "El mapa incompleto",
  "Secteur Restreint",
  "La última transmisión",
];
const cosmetics = [
  { id: "radio", name: "Radio Éclipse", type: "Accesorio", cost: 1, level: 1 },
  { id: "jacket", name: "Chaqueta técnica", type: "Prenda", cost: 2, level: 1 },
  { id: "archives", name: "Archives", type: "Fondo", cost: 1, level: 5 },
  { id: "blackout", name: "Blackout", type: "Skin", cost: 3, level: 7 },
];
const specialties = [
  "Líder",
  "Diplomático/a",
  "Estratega",
  "Analista",
  "Disciplinado/a",
  "Perseverante",
  "Ayudante",
  "Aliado/a",
];
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
export function Studio({
  view,
  setView,
  group,
  setGroup,
  groups,
  students,
  events,
  sessions,
  toggleSession,
}) {
  const [rt, setRt] = useState({}),
    [draft, setDraft] = useState({}),
    [rtSearch, setRtSearch] = useState(""),
    [saved, setSaved] = useState(""),
    [rtUndo, setRtUndo] = useState(null);
  const [chosen, setChosen] = useState(""),
    [evaluations, setEvaluations] = useState({}),
    [comment, setComment] = useState(""),
    [reason, setReason] = useState(""),
    [modal, setModal] = useState(null);
  const [ledger, setLedger] = useState([]),
    [owned, setOwned] = useState({}),
    [equipped, setEquipped] = useState({}),
    [queue, setQueue] = useState([]),
    [notice, setNotice] = useState(""),
    [atelier, setAtelier] = useState(null);
  const [broadcastState, setBroadcastState] = useState({}),
    [dates, setDates] = useState({}),
    [opened, setOpened] = useState(null),
    [watched, setWatched] = useState(false),
    [challenge, setChallenge] = useState(null);
  const [drawn, setDrawn] = useState(null),
    [teamCount, setTeamCount] = useState(5),
    [teamMode, setTeamMode] = useState("teams"),
    [teams, setTeams] = useState([]),
    [kept, setKept] = useState(false);
  const [showStudent, setShowStudent] = useState(null),
    [showExpires, setShowExpires] = useState(null),
    [behaviour, setBehaviour] = useState({}),
    [incidents, setIncidents] = useState([]),
    [incidentText, setIncidentText] = useState("");
  const [baseVariants, setBaseVariants] = useState({}),
    [baseDraft, setBaseDraft] = useState(0),
    [historyFilter, setHistoryFilter] = useState("Todo"),
    [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (showExpires && time >= showExpires) {
      setShowStudent(null);
      setShowExpires(null);
    }
    if (atelier && time >= atelier.expires) setAtelier(null);
  }, [time, showExpires, atelier]);
  useEffect(() => {
    if (view !== "classroom") {
      setShowStudent(null);
      setShowExpires(null);
    }
  }, [view]);
  useEffect(() => {
    setChosen(students[0]?.id || "");
    setOpened(null);
    setChallenge(null);
    setShowStudent(null);
    setShowExpires(null);
    setDrawn(null);
    setTeams([]);
    setKept(false);
    setModal(null);
    setNotice("");
    setSaved("");
    setRtUndo(null);
    setComment("");
    setReason("");
    setAtelier(null);
  }, [group]);
  const person = students.find((s) => s.id === chosen) || students[0];
  const profileIndex =
    baseVariants[chosen] ?? students.findIndex((s) => s.id === person?.id);
  const balance = (id) =>
    4 +
    ledger
      .filter((e) => e.student === id && !e.reversed)
      .reduce((sum, e) => sum + e.amount, 0);
  const xp = (id) =>
    events
      .filter((e) => e.student === id && !e.reversed)
      .reduce((sum, e) => sum + e.value, 0);
  const sorted = [...students].sort((a, b) => {
    const key = (s) =>
      s.name.split(" ").slice(1).join(" ") + " " + s.name.split(" ")[0];
    return key(a).localeCompare(key(b), "es");
  });
  const evalData = evaluations[chosen] || {
    values: {},
    closed: false,
    snapshots: [],
  };
  const finalGrade = Object.keys(descriptions).every((k) => evalData.values[k])
    ? (
        Object.values(evalData.values).reduce((a, b) => a + b, 0) * 0.625
      ).toFixed(3)
    : null;
  const session = sessions[group];
  const rtScope = `${group}-${session?.startedAt || "no-session"}`;
  useEffect(() => {
    setRtUndo(null);
    setSaved("");
  }, [rtScope]);
  const currentRt = rt[rtScope] || {};
  const draftRt = draft[rtScope] || currentRt;
  const broadcastStatus = (i) =>
    broadcastState[`${group}-${i}`] ||
    (i === 0
      ? "available"
      : dates[`${group}-${i}`] &&
          time >= new Date(dates[`${group}-${i}`]).getTime()
        ? "available"
        : "locked");
  function openBroadcast(i) {
    setOpened(i);
    setWatched(false);
    if (broadcastStatus(i) !== "complete")
      setBroadcastState((prev) => ({ ...prev, [`${group}-${i}`]: "seen" }));
  }
  function updateEval(change) {
    setEvaluations((prev) => ({
      ...prev,
      [chosen]: { ...evalData, ...change },
    }));
  }
  function buy(item, id = chosen) {
    if ((owned[id] || []).includes(item.id)) {
      setEquipped((prev) => ({ ...prev, [id]: item.id }));
      setNotice("Cosmético equipado, sin nuevo cobro.");
      return true;
    }
    if (item.level > 1) {
      setNotice(
        `Requiere Nivel ${item.level}. Los avatares demo empiezan en Nivel 1.`,
      );
      return false;
    }
    if (balance(id) < item.cost) {
      setNotice("Saldo insuficiente. La compra no se ha realizado.");
      return false;
    }
    setLedger((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        student: id,
        group,
        amount: -item.cost,
        cosmetic: item.id,
        label: `Compra · ${item.name}`,
        reversed: false,
      },
    ]);
    setOwned((prev) => ({ ...prev, [id]: [...(prev[id] || []), item.id] }));
    setEquipped((prev) => ({ ...prev, [id]: item.id }));
    setNotice(
      "Compra demo aplicada. Puedes revertirla desde el historial de gemas.",
    );
    return true;
  }
  function reversePurchase(entry) {
    setLedger((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, reversed: true } : e)),
    );
    setOwned((prev) => ({
      ...prev,
      [entry.student]: (prev[entry.student] || []).filter(
        (id) => id !== entry.cosmetic,
      ),
    }));
    setEquipped((prev) => ({
      ...prev,
      [entry.student]:
        prev[entry.student] === entry.cosmetic ? "" : prev[entry.student],
    }));
    setNotice("Compra revertida: Esmeraldas restituidas y propiedad retirada.");
  }
  function generateTeams() {
    const count =
      teamMode === "teams"
        ? Number(teamCount)
        : Math.ceil(students.length / Number(teamCount));
    const result = Array.from({ length: count }, () => []);
    shuffle(students).forEach((student, i) =>
      result[i % count].push({
        alias: student.alias,
        index: students.indexOf(student),
      }),
    );
    setTeams(result);
    setKept(false);
  }
  function exportEvaluation() {
    const snapshot = evalData.snapshots.at(-1);
    if (!snapshot) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { demo: true, student: person.name, snapshot },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluacion-demo.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  const studentPicker = (
    <label className="field">
      Alumno
      <select
        aria-label="Alumno del módulo"
        value={chosen}
        onChange={(e) => {
          setChosen(e.target.value);
          setComment(evaluations[e.target.value]?.comment || "");
          setNotice("");
        }}
      >
        {sorted.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
  if (view === "class") return null;
  if (view === "classroom")
    return (
      <main className="island">
        <div className="island-haze" />
        <header className="aula-header">
          <div>
            <p className="eyebrow">ISLA ÉCLIPSE · FRANCIA</p>
            <h1>Protocole Éclipse</h1>
            <p>Una señal. Un equipo. Una salida.</p>
          </div>
          <button
            onClick={() => {
              setShowStudent(null);
              setShowExpires(null);
              setView("class");
            }}
          >
            Volver a la mesa docente
          </button>
        </header>
        <div className="aula-layout">
          <section className="mission-board">
            <p className="eyebrow">MISIÓN COLECTIVA</p>
            <h2>
              {challenge !== null
                ? broadcasts[challenge]
                : "Esperando una señal"}
            </h2>
            <div className="island-map">
              <span>ARCHIVES</span>
              <span>COMMUNICATIONS</span>
              <span>LE QUAI</span>
              <i>◈</i>
            </div>
            {challenge !== null ? (
              <>
                <p>
                  Lisez le message en équipe. Retrouvez trois indices et
                  proposez une réponse en français.
                </p>
                <span className="aula-pill">5–10 minutos · contenido demo</span>
                <button
                  onClick={() => {
                    setBroadcastState((prev) => ({
                      ...prev,
                      [`${group}-${challenge}`]: "complete",
                    }));
                    setChallenge(null);
                  }}
                >
                  Marcar desafío completado
                </button>
              </>
            ) : (
              <>
                <Lock />
                <p>
                  Abre una Retransmisión disponible para descubrir el desafío.
                </p>
              </>
            )}
          </section>
          <section className="agents-board">
            <div className="aula-section-title">
              <h2>Les Agents Éclipse</h2>
              <span>Identidades de aula · sin rankings</span>
            </div>
            <div className="aula-agents">
              {students.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setShowStudent({
                      alias: s.alias,
                      index: baseVariants[s.id] ?? i,
                      equipped: equipped[s.id] || "",
                    });
                    setShowExpires(Date.now() + 120000);
                  }}
                  aria-label={`Mostrar ${s.alias}`}
                >
                  <Agent
                    index={baseVariants[s.id] ?? i}
                    equipped={equipped[s.id]}
                  />
                  <strong>{s.alias}</strong>
                </button>
              ))}
            </div>
          </section>
          <aside className="signal-board">
            <p className="eyebrow">RETRANSMISIONES</p>
            <h2>La frecuencia Éclipse</h2>
            <div className="signal-grid">
              {broadcasts.map((title, i) => (
                <button
                  key={title}
                  disabled={broadcastStatus(i) === "locked"}
                  className={broadcastStatus(i)}
                  aria-label={`Retransmisión ${i + 1}: ${broadcastStatus(i) === "locked" ? "bloqueada" : broadcastStatus(i) === "complete" ? "completada" : "disponible"}`}
                  onClick={() => openBroadcast(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {broadcastStatus(i) === "locked" ? (
                    <Lock />
                  ) : broadcastStatus(i) === "complete" ? (
                    "✓"
                  ) : (
                    "↗"
                  )}
                </button>
              ))}
            </div>
            <p>El próximo mensaje puede cambiarlo todo.</p>
            <div className="radio-art">
              ◉<span>ÉCLIPSE · 104.8</span>
              <div>▂ ▄ ▆ ▄ ▂ ▆ ▃ ▅</div>
            </div>
          </aside>
        </div>
        <footer className="aula-footer">
          Maqueta visual · avatares vectoriales provisionales · solo alias y
          apariencia en esta salida
        </footer>
        {showStudent && (
          <Modal
            title="Show Student · vista temporal"
            onClose={() => {
              setShowStudent(null);
              setShowExpires(null);
            }}
          >
            <div className="show-agent">
              <Agent
                index={showStudent.index}
                equipped={showStudent.equipped}
              />
              <h2>{showStudent.alias}</h2>
              <p>
                Vista segura de aula · expira en{" "}
                {Math.max(0, Math.ceil((showExpires - time) / 1000))} s
              </p>
              <button
                className="solid-button"
                onClick={() => {
                  setShowStudent(null);
                  setShowExpires(null);
                }}
              >
                Retirar de la pantalla
              </button>
            </div>
          </Modal>
        )}
        {opened !== null && (
          <Modal
            title={`Retransmisión ${opened + 1}`}
            onClose={() => setOpened(null)}
          >
            <VideoDemo
              title={broadcasts[opened]}
              watched={watched}
              onWatch={() => setWatched(true)}
            />
            {watched && (
              <button
                className="solid-button"
                onClick={() => {
                  setChallenge(opened);
                  setOpened(null);
                }}
              >
                VER DESAFÍO
              </button>
            )}
          </Modal>
        )}
      </main>
    );
  const header = titles[view];
  return (
    <main className="workspace studio-workspace">
      <header className="topbar">
        <span>CURSO DEMO · 2026 / 27</span>
        <span className="demo-tag">SIMULACIÓN · SIN DATOS REALES</span>
      </header>
      <section className="heading">
        <div>
          <p className="eyebrow">{header[0]}</p>
          <h1>{header[1]}</h1>
          <p>{header[2]}</p>
        </div>
        <label className="group-picker">
          Grupo activo
          <select
            aria-label="Grupo activo"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      </section>
      <SessionControl session={session} onToggle={toggleSession} />
      <nav className="mobile-sections" aria-label="Secciones en tablet">
        <select
          aria-label="Cambiar sección"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          {pages.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </nav>
      {view === "rt" && (
        <>
          <div className="module-toolbar">
            <label className="field">
              Buscar por nombre real
              <input
                type="search"
                placeholder="Apellidos o nombre…"
                value={rtSearch}
                onChange={(e) => setRtSearch(e.target.value)}
              />
            </label>
            <button
              className="outline-button"
              disabled={!session?.active}
              onClick={() => {
                setDraft((prev) => ({
                  ...prev,
                  [rtScope]: Object.fromEntries(
                    students.map((s) => [s.id, "10"]),
                  ),
                }));
                setSaved("");
              }}
            >
              Asignar 10 a todos
            </button>
            <button
              className="solid-button"
              disabled={!session?.active}
              onClick={() => {
                setRtUndo({ ...currentRt });
                setRt((prev) => ({ ...prev, [rtScope]: { ...draftRt } }));
                setSaved("Registro RT guardado en la sesión demo.");
              }}
            >
              Guardar RT
            </button>
          </div>
          {!session?.active && (
            <p className="info-banner">
              Comienza una sesión para registrar RT. Una sesión finalizada es de
              solo lectura.
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
                s.name.toLowerCase().includes(rtSearch.toLowerCase()),
              )
              .map((s) => (
                <div className="rt-table-row" key={s.id}>
                  <strong>
                    {s.name.split(" ").slice(1).join(" ")},{" "}
                    {s.name.split(" ")[0]}
                  </strong>
                  <select
                    aria-label={`RT de ${s.name}`}
                    disabled={!session?.active}
                    value={draftRt[s.id] || ""}
                    onChange={(e) => {
                      setDraft((prev) => ({
                        ...prev,
                        [rtScope]: { ...draftRt, [s.id]: e.target.value },
                      }));
                      setSaved("");
                    }}
                  >
                    <option value="">No evaluado</option>
                    {["10", "5", "0", "A"].map((v) => (
                      <option key={v} value={v}>
                        {v === "A" ? "A · Ausente" : v}
                      </option>
                    ))}
                  </select>
                  <span>
                    {draftRt[s.id] === "A"
                      ? "Ausente · sin efecto en media, Energy o racha"
                      : draftRt[s.id]
                        ? "Registro de tarea"
                        : "Pendiente · no equivale a cero"}
                  </span>
                </div>
              ))}
          </div>
          <p className="info-banner">
            A = Ausente. Los ausentes y no evaluados quedan fuera de la media;
            no se calculan notas ni se modifica XP.
          </p>
          {saved && (
            <div className="module-success" role="status">
              {saved}
              {rtUndo && session?.active && (
                <button
                  onClick={() => {
                    setRt((prev) => ({ ...prev, [rtScope]: rtUndo }));
                    setDraft((prev) => ({ ...prev, [rtScope]: rtUndo }));
                    setRtUndo(null);
                    setSaved("Guardado RT deshecho en la demo.");
                  }}
                >
                  Deshacer guardado
                </button>
              )}
            </div>
          )}
        </>
      )}
      {view === "evaluation" && (
        <>
          <div className="module-toolbar">
            {studentPicker}
            <span className="state-tag">
              {evalData.closed ? "Cerrada · snapshot" : "Borrador docente"}
            </span>
            <span className="warning-tag">
              Pocas evidencias · revisar manualmente
            </span>
          </div>
          <p className="info-banner">
            La ausencia de XP no significa automáticamente desempeño
            insuficiente. Selecciona cada criterio según tu juicio.
          </p>
          <div className="rubric-scroll">
            <table className="rubric-matrix">
              <thead>
                <tr>
                  <th>Criterio</th>
                  {levels.map((level, i) => (
                    <th key={level}>
                      Nivel {i + 1}
                      <small>{level}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(descriptions).map(([category, descriptor]) => (
                  <tr key={category}>
                    <th>{category}</th>
                    {descriptor.map((text, i) => (
                      <td key={text}>
                        <button
                          disabled={evalData.closed}
                          aria-pressed={evalData.values[category] === i + 1}
                          aria-label={`${category}, nivel ${i + 1}`}
                          onClick={() =>
                            updateEval({
                              values: { ...evalData.values, [category]: i + 1 },
                            })
                          }
                        >
                          {text}
                          <span>
                            {evalData.values[category] === i + 1
                              ? "✓ Seleccionado"
                              : "Seleccionar"}
                          </span>
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="evaluation-bottom">
            <label className="field">
              Comentario privado
              <textarea
                disabled={evalData.closed}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  updateEval({ comment: e.target.value });
                }}
                placeholder="Opcional · contexto de la evaluación"
              />
            </label>
            <div className="grade">
              <small>Resultado de la selección</small>
              <strong>
                {finalGrade || "—"} <span>/ 10</span>
              </strong>
              <p>
                Fórmula demo del legado: suma de niveles × 0,625. No proviene de
                XP automático.
              </p>
              {!evalData.closed ? (
                <button
                  className="solid-button"
                  disabled={!finalGrade}
                  onClick={() => setModal("close-eval")}
                >
                  Cerrar evaluación
                </button>
              ) : (
                <>
                  <button
                    className="outline-button"
                    onClick={() => setModal("reopen-eval")}
                  >
                    Reabrir explícitamente
                  </button>
                  <button onClick={exportEvaluation}>
                    Exportar snapshot demo
                  </button>
                </>
              )}
            </div>
          </div>
          {evalData.snapshots.length > 0 && (
            <p className="info-banner">
              {evalData.snapshots.length} snapshot(s) conservados · versión{" "}
              {evalData.snapshots.at(-1).version} · los cierres anteriores no
              cambian al reabrir.
            </p>
          )}
        </>
      )}
      {view === "avatars" && (
        <>
          <div className="module-toolbar">
            {studentPicker}
            <button
              className="outline-button"
              onClick={() => {
                setAtelier({
                  kind: "creation",
                  code: `DEMO-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, "0")}`,
                  expires: Date.now() + 15 * 60000,
                });
                setModal("atelier");
              }}
            >
              Abrir creación inicial
            </button>
            <button
              className="outline-button"
              onClick={() => {
                setAtelier({
                  kind: "atelier",
                  code: `DEMO-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, "0")}`,
                  expires: Date.now() + 15 * 60000,
                });
                setModal("atelier");
              }}
            >
              Abrir Atelier opcional
            </button>
          </div>
          <div className="avatar-shop-layout">
            <section className="agent-profile module-card">
              <Agent index={profileIndex} equipped={equipped[chosen]} />
              <p className="eyebrow">AGENT ÉCLIPSE</p>
              <h2>{person?.alias}</h2>
              <p>{specialties[profileIndex % 8]} · Nivel 1</p>
              <span className="state-tag">Identidad base estable</span>
              <div className="gem-balances">
                <span
                  title="Esmeraldas"
                  aria-label={`Esmeraldas: ${balance(chosen)}`}
                >
                  <Gem />
                  {balance(chosen)}
                </span>
                <span title="Rubíes" aria-label="Rubíes: 0">
                  <Gem type="ruby" />0
                </span>
                <span title="Diamantes" aria-label="Diamantes: 0">
                  <Gem type="diamond" />0
                </span>
              </div>
              <small>
                Saldo inicial de muestra: 4 Esmeraldas. No vinculado a notas o
                comportamiento.
              </small>
              <button
                className="outline-button"
                onClick={() => {
                  setBaseDraft(profileIndex % 5);
                  setModal("customize");
                }}
              >
                Personalizar avatar base
              </button>
            </section>
            <section>
              <div className="module-title">
                <h2>Boutique Avatar</h2>
                <span>Precios de muestra · propiedad permanente</span>
              </div>
              <div className="cosmetic-grid">
                {cosmetics.map((item) => {
                  const acquired = (owned[chosen] || []).includes(item.id),
                    locked = item.level > 1;
                  return (
                    <article
                      className={`cosmetic-card ${locked ? "locked" : ""}`}
                      key={item.id}
                    >
                      <div className={`cosmetic-art art-${item.id}`}>
                        {item.id === "radio" ? (
                          <svg viewBox="0 0 80 80" aria-hidden="true">
                            <rect x="23" y="24" width="35" height="48" rx="6" />
                            <path
                              d="M30 24V8M30 35h18M30 43h18M30 51h18"
                              stroke="#c7c09f"
                              strokeWidth="3"
                            />
                          </svg>
                        ) : (
                          <Agent index={profileIndex} equipped={item.id} />
                        )}
                      </div>
                      <div className="cosmetic-content">
                        <span className="eyebrow">{item.type}</span>
                        <h3>{item.name}</h3>
                        <p>
                          {locked ? (
                            <>
                              <Lock /> Se desbloquea en Nivel {item.level}
                            </>
                          ) : acquired ? (
                            "✓ En propiedad"
                          ) : (
                            "Disponible"
                          )}
                        </p>
                        <div>
                          <span className="gem-price">
                            <Gem />
                            {item.cost}
                          </span>
                          <button
                            className="solid-button"
                            disabled={locked}
                            onClick={() => buy(item)}
                          >
                            {acquired ? "Equipar" : "Comprar"}
                          </button>
                        </div>
                        <button
                          className="text-button"
                          disabled={locked || acquired}
                          onClick={() => {
                            if (
                              !queue.some(
                                (q) =>
                                  q.student === chosen &&
                                  q.cosmetic === item.id,
                              )
                            )
                              setQueue((prev) => [
                                ...prev,
                                { student: chosen, group, cosmetic: item.id },
                              ]);
                            setNotice(
                              "Elección pendiente. Todavía no se han descontado gemas.",
                            );
                          }}
                        >
                          Añadir a pendientes
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
          <section className="module-card">
            <h2>Evolución por nivel</h2>
            <div className="level-track">
              {[
                "Base",
                "Brazalete",
                "Rango",
                "Especialidad",
                "Marco",
                "Detalle avanzado",
                "Élite",
                "Agent final",
              ].map((name, i) => (
                <div key={name} className={i === 0 ? "current" : ""}>
                  <span>{i + 1}</span>
                  {i > 0 && <Lock />}
                  <strong>{name}</strong>
                </div>
              ))}
            </div>
            <p className="muted">
              Vista previa del contenido propuesto. Los XP base de esta demo no
              activan bonus ni progresión automática.
            </p>
          </section>
          {queue.filter((q) => q.group === group).length > 0 && (
            <section className="module-card">
              <h2>Personalizaciones pendientes</h2>
              {queue
                .filter((q) => q.group === group)
                .map((q) => (
                  <div className="queue-row" key={q.student + q.cosmetic}>
                    <span>
                      {students.find((s) => s.id === q.student)?.name} ·{" "}
                      {cosmetics.find((c) => c.id === q.cosmetic)?.name}
                    </span>
                    <button
                      onClick={() => {
                        if (
                          buy(
                            cosmetics.find((c) => c.id === q.cosmetic),
                            q.student,
                          )
                        )
                          setQueue((prev) => prev.filter((p) => p !== q));
                      }}
                    >
                      Validar compra
                    </button>
                    <button
                      onClick={() =>
                        setQueue((prev) => prev.filter((p) => p !== q))
                      }
                    >
                      Retirar elección
                    </button>
                  </div>
                ))}
              <p>
                Validación individual en esta demo. La validación transaccional
                de lotes queda pendiente.
              </p>
            </section>
          )}
          <section className="module-card">
            <h2>Movimientos de gemas</h2>
            {ledger.filter((e) => e.student === chosen).length === 0 ? (
              <p>Sin compras demo.</p>
            ) : (
              ledger
                .filter((e) => e.student === chosen)
                .map((entry) => (
                  <div className="queue-row" key={entry.id}>
                    <span>
                      {entry.label} ·{" "}
                      {entry.reversed
                        ? "Revertida"
                        : `${entry.amount} Esmeraldas`}
                    </span>
                    {!entry.reversed && (
                      <button onClick={() => reversePurchase(entry)}>
                        Revertir compra
                      </button>
                    )}
                  </div>
                ))
            )}
          </section>
          {notice && (
            <p className="module-success" role="status">
              {notice}
            </p>
          )}
        </>
      )}
      {view === "broadcasts" && (
        <>
          <div className="broadcast-intro">
            <div className="broadcast-hero">
              <p className="eyebrow">COMMUNICATIONS · SEÑAL RECIBIDA</p>
              <h2>
                Hay alguien
                <br />
                al otro lado.
              </h2>
              <p>Una aventura colectiva de francés, en nueve escenas.</p>
              <button
                className="solid-button"
                onClick={() => setView("classroom")}
              >
                Abrir Modo Aula
              </button>
            </div>
            <div className="broadcast-grid">
              {broadcasts.map((title, i) => (
                <article
                  className={`broadcast-card ${broadcastStatus(i)}`}
                  key={title}
                >
                  <span className="broadcast-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="state-tag">
                    {broadcastStatus(i) === "locked" ? (
                      <>
                        <Lock /> Bloqueada
                      </>
                    ) : broadcastStatus(i) === "complete" ? (
                      "✓ Completada"
                    ) : (
                      "Disponible"
                    )}
                  </span>
                  <h3>{title}</h3>
                  <button
                    disabled={broadcastStatus(i) === "locked"}
                    onClick={() => openBroadcast(i)}
                  >
                    {broadcastStatus(i) === "complete"
                      ? "Volver a ver"
                      : "Abrir Retransmisión"}
                  </button>
                  {broadcastStatus(i) === "locked" && (
                    <>
                      <label className="field">
                        Fecha de desbloqueo
                        <input
                          type="date"
                          aria-label={`Fecha de Retransmisión ${i + 1}`}
                          value={dates[`${group}-${i}`] || ""}
                          onChange={(e) =>
                            setDates((prev) => ({
                              ...prev,
                              [`${group}-${i}`]: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <button
                        className="text-button"
                        onClick={() =>
                          setBroadcastState((prev) => ({
                            ...prev,
                            [`${group}-${i}`]: "available",
                          }))
                        }
                      >
                        Desbloquear manualmente
                      </button>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
          {challenge !== null && (
            <section className="module-card">
              <p className="eyebrow">
                DESAFÍO COLECTIVO · CONTENIDO DE MUESTRA
              </p>
              <h2>{broadcasts[challenge]}</h2>
              <p>
                Lisez le message en équipe. Retrouvez trois indices et proposez
                une réponse en français.
              </p>
              <p>
                Duración prevista: 5–10 minutos. No concede XP ni gemas
                automáticamente.
              </p>
              <button
                className="solid-button"
                onClick={() => {
                  setBroadcastState((prev) => ({
                    ...prev,
                    [`${group}-${challenge}`]: "complete",
                  }));
                  setChallenge(null);
                }}
              >
                Marcar desafío completado
              </button>
            </section>
          )}
        </>
      )}
      {view === "organization" && (
        <div className="organization-grid">
          <section className="module-card roulette">
            <p className="eyebrow">UN AGENTE AL AZAR</p>
            <h2>¿Quién toma la palabra?</h2>
            <div className="roulette-ring">
              {drawn ? (
                <>
                  <Agent index={drawn.index} />
                  <strong>{drawn.alias}</strong>
                </>
              ) : (
                <span>◉</span>
              )}
            </div>
            <button
              className="solid-button"
              onClick={() => {
                const s = shuffle(students)[0];
                setDrawn({ alias: s.alias, index: students.indexOf(s) });
              }}
            >
              Girar ruleta
            </button>
            <p>Solo alias y avatar. Ningún dato de evaluación interviene.</p>
          </section>
          <section className="module-card">
            <p className="eyebrow">TRABAJO COLECTIVO</p>
            <h2>Equipos que se encuentran.</h2>
            <div className="module-toolbar">
              <label className="field">
                Distribución
                <select
                  value={teamMode}
                  onChange={(e) => setTeamMode(e.target.value)}
                >
                  <option value="teams">Número de equipos</option>
                  <option value="size">Alumnos por equipo</option>
                </select>
              </label>
              <label className="field">
                Cantidad
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={teamCount}
                  onChange={(e) =>
                    setTeamCount(
                      Math.max(1, Math.min(30, Number(e.target.value) || 1)),
                    )
                  }
                />
              </label>
            </div>
            <button
              className="solid-button"
              disabled={kept}
              onClick={generateTeams}
            >
              {teams.length ? "Volver a sortear" : "Generar equipos"}
            </button>
            {teams.length > 0 && (
              <button className="outline-button" onClick={() => setKept(!kept)}>
                {kept ? "Liberar equipos" : "Mantener equipos"}
              </button>
            )}
            <div className="team-grid">
              {teams.map((team, i) => (
                <article key={i}>
                  <h3>Equipo {i + 1}</h3>
                  {team.map((s) => (
                    <span key={s.alias}>{s.alias}</span>
                  ))}
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
      {view === "history" && (
        <>
          <div className="module-toolbar">
            <label className="field">
              Categoría
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
              >
                {["Todo", "XP", "Gemas", "Evaluación", "Comportamiento"].map(
                  (f) => (
                    <option key={f}>{f}</option>
                  ),
                )}
              </select>
            </label>
          </div>
          <div className="timeline module-card">
            {(historyFilter === "Todo" || historyFilter === "XP") &&
              events
                .filter((e) => e.group === group)
                .slice()
                .reverse()
                .map((e) => (
                  <article key={e.id}>
                    <span className="timeline-dot" />
                    <div>
                      <small>XP · {e.category}</small>
                      <h3>
                        {e.name} · +{e.value} XP base
                      </h3>
                      <p>
                        {e.reversed
                          ? "Corregido: registro deshecho."
                          : "Observación registrada en la demo."}
                      </p>
                    </div>
                  </article>
                ))}
            {(historyFilter === "Todo" || historyFilter === "Gemas") &&
              ledger
                .filter((e) => e.group === group)
                .map((e) => (
                  <article key={e.id}>
                    <span className="timeline-dot" />
                    <div>
                      <small>Gemas</small>
                      <h3>
                        {students.find((s) => s.id === e.student)?.name} ·{" "}
                        {e.label}
                      </h3>
                      <p>
                        {e.reversed
                          ? "Compra revertida"
                          : `${e.amount} Esmeraldas`}
                      </p>
                    </div>
                  </article>
                ))}
            {(historyFilter === "Todo" || historyFilter === "Evaluación") &&
              students.flatMap((s) =>
                (evaluations[s.id]?.snapshots || []).map((snapshot) => (
                  <article key={s.id + snapshot.version}>
                    <span className="timeline-dot" />
                    <div>
                      <small>Evaluación · snapshot v{snapshot.version}</small>
                      <h3>{s.name}</h3>
                      <p>
                        Cierre docente · {snapshot.grade}/10 ·{" "}
                        {new Date(snapshot.at).toLocaleString("es-ES")}
                      </p>
                    </div>
                  </article>
                )),
              )}
            {(historyFilter === "Todo" || historyFilter === "Evaluación") &&
              students.flatMap((student) =>
                (evaluations[student.id]?.reopenLog || []).map(
                  (entry, index) => (
                    <article key={`${student.id}-reopen-${index}`}>
                      <span className="timeline-dot" />
                      <div>
                        <small>Evaluación · reapertura explícita</small>
                        <h3>{student.name}</h3>
                        <p>
                          {entry.reason} ·{" "}
                          {new Date(entry.at).toLocaleString("es-ES")}
                        </p>
                      </div>
                    </article>
                  ),
                ),
              )}
            {(historyFilter === "Todo" || historyFilter === "Comportamiento") &&
              incidents
                .filter((e) => e.group === group)
                .map((e) => (
                  <article key={e.id}>
                    <span className="timeline-dot" />
                    <div>
                      <small>Comportamiento · privado</small>
                      <h3>{e.name}</h3>
                      <p>
                        {e.state} · {e.text}
                      </p>
                    </div>
                  </article>
                ))}
            <p className="muted">
              Aquí aparecerán tus operaciones demo. Solo visibles para la
              docente; no se proyectan.
            </p>
          </div>
        </>
      )}
      {view === "behaviour" && (
        <>
          <div className="module-toolbar">{studentPicker}</div>
          <section className="module-card">
            <h2>{person?.name}</h2>
            <p>
              Los estados no modifican XP, notas, RT, Energy o Gems en esta
              demo.
            </p>
            <div className="behaviour-options">
              {["Normal", "Vigilancia", "Alerta", "Código Rojo"].map(
                (state) => (
                  <button
                    key={state}
                    aria-pressed={(behaviour[chosen] || "Normal") === state}
                    onClick={() =>
                      setBehaviour((prev) => ({ ...prev, [chosen]: state }))
                    }
                  >
                    {state}
                  </button>
                ),
              )}
            </div>
            <label className="field">
              Contexto privado de la incidencia
              <textarea
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                placeholder="Descripción de muestra · no incluir datos reales"
              />
            </label>
            <button
              className="solid-button"
              disabled={!incidentText.trim()}
              onClick={() => {
                setIncidents((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    student: chosen,
                    name: person.name,
                    group,
                    state: behaviour[chosen] || "Normal",
                    text: incidentText,
                  },
                ]);
                setIncidentText("");
                setNotice(
                  "Incidencia guardada solo en el historial privado demo.",
                );
              }}
            >
              Registrar incidencia
            </button>
            <p className="info-banner">
              Vidas, propuesta de parte y restricciones de juego no se calculan:
              su compatibilidad está pendiente. Ninguna medida disciplinaria se
              aplica automáticamente.
            </p>
            {notice && <p role="status">{notice}</p>}
          </section>
        </>
      )}
      {view === "settings" && (
        <div className="settings-grid">
          <section className="module-card">
            <p className="eyebrow">GESTIÓN DOCENTE</p>
            <h2>Grupos y alumnado</h2>
            <p>
              {groups.find((g) => g.id === group)?.name} · {students.length}{" "}
              alumnos ficticios.
            </p>
            <p>
              Alias gestionados por la docente. Sin cuentas permanentes de
              alumnado.
            </p>
            <button
              className="outline-button"
              onClick={() => setModal("roster")}
            >
              Ver listado del grupo
            </button>
            <p className="muted">
              Alta, importación y edición persistentes: pendientes de la fase
              funcional.
            </p>
          </section>
          <section className="module-card">
            <p className="eyebrow">AVATARES</p>
            <h2>Acceso temporal, bajo tu control.</h2>
            <p>
              Creación inicial o Atelier opcional. No reservar ordenadores no
              elimina gemas ni desbloqueos.
            </p>
            <button className="solid-button" onClick={() => setView("avatars")}>
              Gestionar avatares
            </button>
          </section>
          <section className="module-card">
            <p className="eyebrow">PRIVACIDAD</p>
            <h2>Dos experiencias separadas.</h2>
            <p>
              La vista Aula compone alias y apariencia. No muestra nombres
              reales, notas, RT, incidentes ni vidas.
            </p>
            <p>
              Esta separación es una maqueta frontend. La fase funcional deberá
              imponerla en API, autorización y almacenamiento.
            </p>
          </section>
          <section className="module-card">
            <p className="eyebrow">ALCANCE DE LA DEMO</p>
            <h2>Diseño navegable, datos en memoria.</h2>
            <p>
              Sin credenciales, backend, vídeos definitivos, render 3D ni
              garantías de producción. Recargar reinicia el estado.
            </p>
            <p>
              Bonus condicionado por comportamiento, precios definitivos,
              progresión y campos individuales de aula: pendientes de
              decisión/validación.
            </p>
          </section>
        </div>
      )}
      <footer className="workspace-footer">
        Prototipo navegable · datos sintéticos en memoria · sin conexión a
        alumnado real
      </footer>
      {opened !== null && (
        <Modal
          title={`Retransmisión ${opened + 1} · ${broadcasts[opened]}`}
          onClose={() => setOpened(null)}
        >
          <VideoDemo
            title={broadcasts[opened]}
            watched={watched}
            onWatch={() => setWatched(true)}
          />
          {watched && (
            <button
              className="solid-button"
              onClick={() => {
                setChallenge(opened);
                setOpened(null);
              }}
            >
              VER DESAFÍO
            </button>
          )}
        </Modal>
      )}
      {modal === "close-eval" && (
        <Modal title="Cerrar evaluación demo" onClose={() => setModal(null)}>
          <p>
            Se conservará una copia de tu selección para {person?.name}. No
            cambiará con nuevas observaciones.
          </p>
          <button
            className="solid-button"
            onClick={() => {
              updateEval({
                closed: true,
                comment,
                snapshots: [
                  ...evalData.snapshots,
                  {
                    version: evalData.snapshots.length + 1,
                    values: { ...evalData.values },
                    grade: finalGrade,
                    comment,
                    at: new Date().toISOString(),
                  },
                ],
              });
              setModal(null);
            }}
          >
            Confirmar cierre
          </button>
        </Modal>
      )}
      {modal === "reopen-eval" && (
        <Modal title="Reabrir evaluación" onClose={() => setModal(null)}>
          <label className="field">
            Motivo de reapertura
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            className="solid-button"
            disabled={!reason.trim()}
            onClick={() => {
              updateEval({
                closed: false,
                reopenReason: reason,
                reopenLog: [
                  ...(evalData.reopenLog || []),
                  { reason, at: new Date().toISOString() },
                ],
              });
              setReason("");
              setModal(null);
            }}
          >
            Confirmar reapertura
          </button>
          <p>Se conserva el snapshot anterior.</p>
        </Modal>
      )}
      {modal === "atelier" && (
        <Modal
          title="Sesión temporal de avatar · simulación"
          onClose={() => setModal(null)}
        >
          {atelier ? (
            <>
              <p>
                {atelier.kind === "creation"
                  ? "Creación inicial"
                  : "Atelier opcional"}{" "}
                · solo el grupo activo
              </p>
              <div className="access-code">{atelier.code}</div>
              <p>
                Expira en {Math.ceil((atelier.expires - time) / 60000)} minutos.
                Código de muestra: no habilita acceso externo ni permite elegir
                una identidad ajena.
              </p>
              <button
                className="outline-button"
                onClick={() => setModal("atelier-preview")}
              >
                Previsualizar Atelier
              </button>
              <button className="solid-button" onClick={() => setAtelier(null)}>
                Cerrar acceso temporal
              </button>
            </>
          ) : (
            <p>Acceso cerrado o expirado.</p>
          )}
        </Modal>
      )}
      {modal === "atelier-preview" && (
        <Modal
          title="Atelier Avatar · vista individual de muestra"
          onClose={() => setModal(null)}
        >
          {atelier ? (
            <>
              <p>
                Previsualización docente de un acceso temporal. Sin cuentas
                permanentes, notas, nombres reales ni disciplina.
              </p>
              <div className="show-agent">
                <Agent index={profileIndex} equipped={equipped[chosen]} />
                <h2>{person?.alias}</h2>
                <div className="gem-balances">
                  <span aria-label={`Esmeraldas: ${balance(chosen)}`}>
                    <Gem />
                    {balance(chosen)}
                  </span>
                </div>
              </div>
              <div className="atelier-items">
                {cosmetics.map((item) => (
                  <div key={item.id}>
                    <strong>{item.name}</strong>
                    <span>
                      {item.level > 1
                        ? `Bloqueado · Nivel ${item.level}`
                        : `${item.cost} Esmeralda(s)`}
                    </span>
                    <button
                      className="outline-button"
                      disabled={item.level > 1}
                      onClick={() => buy(item)}
                    >
                      {(owned[chosen] || []).includes(item.id)
                        ? "Equipar"
                        : "Comprar"}
                    </button>
                  </div>
                ))}
              </div>
              {notice && <p role="status">{notice}</p>}
              <button
                onClick={() => {
                  setAtelier(null);
                  setNotice("");
                }}
              >
                Cerrar acceso demo
              </button>
            </>
          ) : (
            <p>
              Sesión cerrada o expirada. La personalización no está disponible.
            </p>
          )}
        </Modal>
      )}
      {modal === "customize" && (
        <Modal
          title="Personalización base · vista previa"
          onClose={() => setModal(null)}
        >
          <div className="show-agent">
            <Agent index={baseDraft} />
            <h2>{person?.alias}</h2>
            <p>
              Choisis ton Agent Éclipse. Variantes vectoriales de muestra; el
              catálogo 3D definitivo sigue pendiente.
            </p>
            <div className="base-choices">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  aria-label={`Apariencia base ${index + 1}`}
                  aria-pressed={baseDraft === index}
                  onClick={() => setBaseDraft(index)}
                >
                  <Agent index={index} />
                </button>
              ))}
            </div>
            <button
              className="solid-button"
              onClick={() => {
                setBaseVariants((prev) => ({ ...prev, [chosen]: baseDraft }));
                setModal(null);
                setNotice(
                  "Identidad base demo guardada. No se cobra ni se modifica XP.",
                );
              }}
            >
              Guardar avatar base
            </button>
            <p>
              La evolución futura cambia equipamiento y marcos, no el rostro.
            </p>
          </div>
        </Modal>
      )}
      {modal === "roster" && (
        <Modal
          title="Alumnado demo · listado privado"
          onClose={() => setModal(null)}
        >
          <div className="roster-modal">
            {sorted.map((s) => (
              <p key={s.id}>
                <strong>{s.name}</strong> · {s.alias}
              </p>
            ))}
          </div>
        </Modal>
      )}
    </main>
  );
}
function VideoDemo({ title, watched, onWatch }) {
  return (
    <div className="video-demo">
      <div className="video-scene">
        <span>COMMUNICATIONS · ÉCLIPSE</span>
        <h2>{title}</h2>
        <div className="video-wave">▁ ▃ ▆ ▂ ▅ ▇ ▃ ▁</div>
        <p>Un message arrive de l’île…</p>
      </div>
      <p>
        Escena de muestra sin vídeo definitivo. El siguiente control simula
        haber visto el vídeo.
      </p>
      <button className="outline-button" disabled={watched} onClick={onWatch}>
        {watched ? "✓ Escena vista" : "Simular fin del vídeo"}
      </button>
    </div>
  );
}
