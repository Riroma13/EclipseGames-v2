# EclipseGames Next — Starter Pack

Este paquete define la base de producto para rediseñar EclipseGames sin heredar ciegamente la implementación anterior.

## Atlas de clase · frontend y primera API

Atlas es la entrada principal. Incluye autenticación docente, creación de grupos, sesiones manuales, panel rápido de alumno, XP base con correcciones trazables y RT masivo persistido en SQLite, con historial y deshacer. Consultar [BACKEND.md](BACKEND.md) para crear acceso docente y arrancar `npm run api` junto a `npm run dev`.

Las cuatro demos visuales siguen disponibles en `/?gallery=1`; `/?design=atlas` abre la demo Atlas. Sus otros módulos (Evaluación, Avatares, Retransmisiones, Organización, Comportamiento y Modo Aula) conservan datos ficticios en memoria y arte provisional. No están conectados a la API.

Consultar [PROTOTYPE.md](PROTOTYPE.md) para su cobertura. `npm run export:demo` genera un HTML autónomo de las demos. No se ha publicado en Vercel.

## Orden de lectura

1. `PRODUCT-CONTRACT.md`
2. `CURRENT-CAPABILITIES.md`
3. `REDESIGN-BRIEF.md`
4. `DESIGN-SYSTEM.md`
5. `MIGRATION-PLAN.md`
6. `ROADMAP.md`
7. `START-CODEX-PROMPT.md`

## Correcciones de producto aportadas posteriormente

Consultar [el índice de correcciones](docs/corrections/README.md) junto con los documentos base antes de ampliar el prototipo. Incluye los tres DOCX originales (rúbrica XP, avatares/skins y ajustes funcionales/visuales), transcripciones, imágenes de referencia y análisis de compatibilidad. La incorporación documental no significa que todas las funciones estén implementadas.

## Principio de rediseño

La V2 puede replantear UI, UX, navegación y flujos funcionales, pero no debe romper los invariantes de producto, privacidad y evaluación.

El repositorio antiguo se usa como referencia funcional y fuente de lógica probada, no como plantilla visual obligatoria.

## Objetivo de la primera fase

Antes de implementar:
- auditar el producto actual;
- decidir qué conservar;
- proponer una nueva arquitectura de experiencia;
- producir un prototipo navegable;
- validar el flujo docente principal.
