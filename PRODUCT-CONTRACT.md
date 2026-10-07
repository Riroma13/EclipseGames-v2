# PRODUCT CONTRACT — EclipseGames Next

Estas reglas son invariantes. El rediseño puede cambiar la forma de interactuar, no su significado.

## Usuario y contexto

- Usuario principal: profesor / Game Master.
- UI del profesor: español.
- Uso prioritario: portátil y tablet.
- Uso en directo con grupos de aproximadamente 30 alumnos.
- No existen cuentas permanentes de alumnado.
- El producto es una herramienta docente primero y una capa de juego después.

## Dominios separados

Mantener separados:
- evaluación académica;
- XP / gamificación;
- RT / tareas;
- comportamiento;
- narrativa.

Reglas:
- comportamiento nunca reduce notas, XP de evidencia ni RT;
- narrativa nunca modifica automáticamente notas, XP, RT, Energy, comportamiento ni Gems;
- gamificación no puede convertirse en una regla oculta de calificación.

## XP y evaluación

- XP es evidencia de observación, no la nota oficial.
- Categorías: Comunicación, Precisión, Constancia, Colaboración.
- El profesor conserva juicio profesional.
- Una evaluación cerrada conserva semántica de snapshot.
- Reabrir una evaluación debe ser explícito y trazable.

## RT y Energy

- RT usa registros 10 / 5 / 0 / no evaluado.
- Los no evaluados no cuentan en la media.
- Energy es representación gamificada del trabajo/implicación, no una nota académica.
- Comportamiento no altera la semántica académica de RT o Energy.

## Gems

Moneda canónica:
- Emerald;
- Ruby;
- Diamond.

`coins` es legado de lectura/migración, no el modelo canónico nuevo.

## Comportamiento

Estados conceptuales:
- Normal;
- Vigilancia;
- Alerta;
- Código Rojo.

Puede restringir mecánicas de juego según reglas explícitas, pero nunca modificar evaluación académica de forma punitiva.

## Privacidad y proyección

La separación profesor / aula es una frontera de datos, no solo visual.

### Profesor
Puede ver información privada necesaria para enseñar y evaluar.

### Proyección
Solo puede recibir datos explícitamente clasificados como seguros para aula.

Debe evitar, entre otros:
- nombre real cuando no sea necesario;
- notas;
- RT exacto;
- rúbricas;
- comentarios privados;
- incidentes;
- historial disciplinario;
- historial detallado.

### Show Student
Debe ser una vista temporal, deliberada y segura para proyección.

La privacidad se impone en API / capa autoritativa de datos, no únicamente ocultando componentes.

## Ranking

No hay rankings públicos de alumnado por XP, nota, RT, Energy, Gems o nivel.

## Narrativa

- Narrativa colectiva, ligera y opcional.
- Debe consumir poco tiempo de clase.
- Puede tener eventos, retos, pistas y progreso de grupo.
- No contamina evaluación, comportamiento ni economía.

## UX

Prioridad:
`encontrar alumno → registrar acción → seguir dando clase`

Objetivos:
- acciones frecuentes en 1–2 interacciones cuando sea viable;
- comentarios no obligatorios en acciones rutinarias;
- bulk entry para RT;
- corrección/undo en acciones frecuentes;
- legible a distancia en proyección;
- responsive práctico.

## No introducir sin evidencia

No añadir por defecto:
- cuentas de alumnado;
- portal de familias;
- multi-centro;
- multi-tenancy empresarial;
- app móvil nativa;
- rankings públicos;
- generación automática de notas por IA;
- narrativa compleja ramificada.
