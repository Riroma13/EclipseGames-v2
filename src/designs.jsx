import React, { useEffect, useState } from "react";
import "./designs.css";

export const designs = [
  {
    id: "mesa",
    number: "01",
    name: "Mesa docente",
    tag: "Clara · sobria · directa",
    description:
      "El diseño actual: navegación lateral, superficies limpias y acciones siempre a mano.",
    detail: "Para priorizar la gestión rápida de clase.",
  },
  {
    id: "cuaderno",
    number: "02",
    name: "Cuaderno de campo",
    tag: "Cálida · editorial · pausada",
    description:
      "Navegación superior, tonos papel y tinta, títulos editoriales y contenido con aire.",
    detail: "Para una experiencia cercana, centrada en observar y acompañar.",
  },
  {
    id: "signal",
    number: "03",
    name: "Signal Éclipse",
    tag: "Oscura · técnica · inmersiva",
    description:
      "Una estación de comunicaciones: azul noche, acentos turquesa y paneles compactos.",
    detail: "Para dar personalidad tecnológica al universo Éclipse.",
  },
  {
    id: "atlas",
    number: "04",
    name: "Atlas de clase",
    tag: "Luminosa · costera · táctil",
    description:
      "Azul mar, arena y coral; navegación flotante y bloques grandes de lectura rápida.",
    detail: "Para unir el espacio docente con la aventura de la isla.",
  },
];

function readDesign() {
  const id = new URLSearchParams(location.search).get("design");
  return designs.some((d) => d.id === id) ? id : null;
}
export function DesignGallery({ children }) {
  const [design, setDesign] = useState(readDesign),
    [gallery, setGallery] = useState(!readDesign());
  useEffect(() => {
    document.documentElement.dataset.design = design || "mesa";
    document.title = gallery
      ? "EclipseGames · Cuatro diseños"
      : `EclipseGames · ${designs.find((d) => d.id === design)?.name}`;
  }, [design, gallery]);
  useEffect(() => {
    function navigate() {
      const value = readDesign();
      setDesign(value);
      setGallery(!value);
    }
    window.addEventListener("popstate", navigate);
    return () => window.removeEventListener("popstate", navigate);
  }, []);
  function choose(id) {
    setDesign(id);
    setGallery(false);
    const url = new URL(location.href);
    url.searchParams.set("design", id);
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
  }
  function openGallery() {
    setGallery(true);
    const url = new URL(location.href);
    url.searchParams.delete("design");
    url.searchParams.set("gallery", "1");
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
  }
  if (gallery)
    return (
      <main className="design-gallery">
        <header className="gallery-header">
          <a className="gallery-brand" href="?">
            ◐ EclipseGames <span>Laboratorio de diseño</span>
          </a>
          <span className="gallery-badge">
            4 DISEÑOS · PROTOTIPOS INTERACTIVOS
          </span>
        </header>
        <section className="gallery-intro">
          <p>EL MISMO PRODUCTO. CUATRO FORMAS DE SENTIRLO.</p>
          <h1>
            ¿Cómo quieres
            <br />
            vivir tu clase?
          </h1>
          <div>
            Explora cuatro direcciones visuales con los mismos alumnos ficticios
            y los mismos flujos. Abre una demo, recorre sus pantallas y cambia
            de diseño desde el comparador.
          </div>
        </section>
        <div className="design-grid">
          {designs.map((d) => (
            <article className={`design-option option-${d.id}`} key={d.id}>
              <div className="design-preview" aria-hidden="true">
                <div className="preview-nav">
                  <span>◐</span>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="preview-content">
                  <span className="preview-eyebrow">
                    ECLIPSEGAMES · {d.number}
                  </span>
                  <h2>
                    {d.id === "mesa"
                      ? "Tu grupo, a mano."
                      : d.id === "cuaderno"
                        ? "Cada clase cuenta."
                        : d.id === "signal"
                          ? "Señal recibida."
                          : "Una clase, un horizonte."}
                  </h2>
                  <div className="preview-search" />
                  <div className="preview-desk">
                    <div className="preview-rows">
                      {[1, 2, 3].map((n) => (
                        <div key={n}>
                          <i />
                          <span />
                          <b />
                        </div>
                      ))}
                    </div>
                    <div className="preview-panel">
                      <i />
                      <span />
                      <span />
                      <div>
                        <b>+1</b>
                        <b>+2</b>
                        <b>+3</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="design-description">
                <div className="design-option-title">
                  <span>{d.number}</span>
                  <h2>{d.name}</h2>
                </div>
                <p className="design-tag">{d.tag}</p>
                <p>{d.description}</p>
                <small>{d.detail}</small>
                <button
                  onClick={() => choose(d.id)}
                  aria-label={`Probar ${d.name}`}
                >
                  Probar diseño <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <section className="gallery-guide">
          <h2>Qué puedes probar</h2>
          <p>
            Acceso demo · XP y deshacer · Sesiones y RT · Rúbrica · Avatares y
            gemas · Retransmisiones · Organización · Modo Aula
          </p>
          <p>
            Los cambios de diseño mantienen tu sesión durante la comparación.
            Volver al catálogo o recargar reinicia los datos demo. Sin alumnado
            real, sin backend y con assets provisionales.
          </p>
        </section>
        <footer>
          Prototipos de EclipseGames · La dirección visual cambia; las reglas y
          la privacidad se conservan.
        </footer>
      </main>
    );
  return (
    <>
      <div
        className="design-comparator"
        role="region"
        aria-label="Comparador de diseños"
      >
        <button className="gallery-return" onClick={openGallery}>
          ← Los 4 diseños
        </button>
        <label>
          Diseño
          <select
            aria-label="Elegir diseño"
            value={design}
            onChange={(e) => choose(e.target.value)}
          >
            {designs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number} · {d.name}
              </option>
            ))}
          </select>
        </label>
        <span>Datos ficticios · misma funcionalidad</span>
      </div>
      {children}
    </>
  );
}
