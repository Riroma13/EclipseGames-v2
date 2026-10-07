# MIGRATION PLAN — de EclipseGames a EclipseGames Next

## Principio

No hacer un port completo.

Clasificar cada parte del repo anterior como:
- REUSE;
- ADAPT;
- REBUILD;
- DROP;
- DEFER.

## Reutilizar primero

Candidatos fuertes:
- reglas de dominio;
- tests de cálculos;
- privacidad de proyección;
- tests de autorización;
- semántica de snapshots;
- migraciones de datos útiles;
- modelos de grupos/alumnos;
- historial;
- lógica narrativa estable.

## Adaptar

Probablemente:
- API;
- repositorios;
- autenticación docente;
- exportación;
- seed/demo;
- persistencia.

## Reconstruir

Por defecto:
- frontend;
- navegación;
- layout;
- componentes visuales;
- design system;
- interacción docente;
- proyección visual;
- Show Student visual;
- narrativa visual.

## No arrastrar automáticamente

- código operacional incompleto;
- scripts de backup/restore no cerrados;
- abstracciones nacidas solo para resolver un bloqueo antiguo;
- deuda irrelevante para la nueva arquitectura;
- compatibilidad UI innecesaria.

## Estrategia

### Fase A — prototipo
Datos demo únicamente.

### Fase B — núcleo funcional
Portar lógica y tests imprescindibles.

### Fase C — compatibilidad
Definir importador desde EclipseGames anterior.

### Fase D — producción
Hardening, backup, restore, retención y privacidad con evidencia real.

## Regla

No dar por cerrado ningún requisito de producción porque existiera parcialmente en el repo anterior.
