# EclipseGames-V2 — primera arquitectura de producto y UX

Estado original: propuesta previa a implementación. Estado actual: núcleo docente demo implementado; aplicación completa pendiente. Consultar la actualización siguiente.

**Actualización documental:** posteriormente se ha construido el núcleo demo descrito en PROTOTYPE.md y se han incorporado [tres fuentes de corrección](docs/corrections/README.md). Las propuestas históricas de este documento sobre narrativa, horario, RT y avatares deben leerse con esas correcciones. La auditoría del código anterior conserva su carácter histórico; no constituye una obligación de copiar sus reglas o interfaz.

## 1. Auditoría del repositorio de referencia

Se han leído, en este orden, PRODUCT-CONTRACT.md, CURRENT-CAPABILITIES.md, REDESIGN-BRIEF.md, DESIGN-SYSTEM.md, MIGRATION-PLAN.md y ROADMAP.md.

El checkout de V2 contiene ocho documentos de definición, sin código, manifiestos de dependencias o pruebas. Es el espacio del rediseño, denominado también EclipseGames-Next por el mantenedor; no es la implementación anterior.

Referencia autorizada: https://github.com/Riroma13/EclipseGames, rama main, revisión exacta `7ea70f9f2a4d023bf335147c184cbe3c6dfa3e1f`. Se inspeccionó una copia separada en `/tmp/eclipsegames-reference`, sin modificar su código. Las rutas de esta sección y de la matriz se refieren a esa revisión del repositorio anterior.

**Arquitectura observada.** Monorepo pnpm con `apps/web` (React 19, Vite 7, React Router), `apps/api` (Fastify 5, SQLite/better-sqlite3 y Drizzle), `packages/domain` (reglas TypeScript) y `packages/contracts` (Zod). Autenticación docente con cookie y Argon2. Hay 19 migraciones SQL, Vitest y Playwright. `package.json` declara pnpm 11.9.0 y CI usa Node 22; el entorno de auditoría dispone de Node 24.19.0 y pnpm 11.19.0. No se debe confundir una diferencia de herramientas con un defecto de aplicación.

**Hallazgos de dominio.** `packages/domain/src/xp/rules.ts` define cuatro categorías, XP base 1/2/3 y bonus de especialidad +1. `apps/api/src/xp/service.ts` conserva idempotencia, atribución a sesión/trimestre y reversión de evidencia. `apps/api/src/rubric/repository.ts` agrega XP base, no XP efectivo; `rubric/service.ts` registra cierre, snapshot versionado, revisión esperada y reapertura con motivo. Conservar esta separación y evitar dos fórmulas distintas entre API y paquete de dominio.

**Dos decisiones pendientes que afectan a un port literal.**

- `rt/domain.ts` permite 10/5/0/ABSENT; `replayRt` excluye ABSENT de la media y conserva racha al saltarlo. La UI distingue selección vacía de “Ausente”; la API no ofrece en las rutas inspeccionadas un comando explícito para borrar un registro y volver a pendiente. El contrato V2 dice “no evaluado”. No equiparar automáticamente ausencia, pendiente y cero; resolver la representación y el camino de corrección antes de portar persistencia.
- `behaviour/domain.ts` desactiva bonus con Alerta/Código Rojo, y `xp/service.ts` aplica esa política al XP efectivo. La rúbrica sigue usando XP base. No se ha observado una resta de evidencia ya registrada, pero el alcance de “XP de evidencia” en V2 exige decidir si ese bonus es estrictamente gamificado o también evidencia protegida. No portar esta dependencia sin una interpretación explícita del contrato; no cambiarla en el legado durante esta tarea.

**Privacidad.** Existen varias superficies históricas de DTO, por lo que un mapper aislado no identifica el contrato efectivo. `test/privacy/projection.test.ts` comprueba rutas antiguas ausentes y un display con allowlist. `projection/classroom-composer.ts` y `classroom-mapper.ts` componen avatar restringido, Energy visual y Gems; Show Student añade estado ALERT. Este último campo requiere revisión frente a la frontera privada de comportamiento de V2. `lease-registry.ts` aporta expiración, revocación, intercambio de uso único, hashes y throttling; `server.ts` conecta validación de sesión docente. El TTL existente es 120 segundos, configurable entre 30 y 300. Reutilizar mecanismos de acceso y probarlos; adaptar los campos permitidos al contrato V2.

**Narrativa y economía.** `narrative/domain.ts` deriva estados por predecesores/trimestre y valida inicio y mecánica vinculada antes de completar. `narrative/service.test.ts` contiene casos de concurrencia, idempotencia, rollback y aislamiento. `projection/narrative-composer.ts` limita la salida a evento disponible/completado y pistas reveladas. Coins permanece en consultas privadas de solo lectura, con pruebas que rechazan mutaciones; Gems tiene orquestación y reconciliación propias. No inferir equivalencia monetaria desde estos módulos.

**UX observada en código.** `WorkspaceShell.tsx` mezcla etiquetas inglesas y españolas y ofrece Home/Classroom/Events/Challenges/Minigames/Narrativa. `WorkspaceApp.tsx` incorpora RT e historial antes del roster y muestra rúbrica/comportamiento al seleccionar alumno. `StudentPanel.tsx` combina XP, Gems e historial coins. Registrar XP requiere elegir alumno, categoría y valor; la búsqueda por nombre/alias normaliza acentos y ya es aprovechable. `RtGrid.tsx` presenta una cuadrícula, pero guarda cada cambio mediante un request individual aunque la API acepta lotes transaccionales. Son hallazgos estáticos, pendientes de medición con docentes; no se atribuyen tiempos de uso no observados.

**Operación.** `ops/backup/README.md` describe restic cifrado y un drill; advierte que la copia local no sustituye verificar restauración cifrada. La presencia de scripts no demuestra operación productiva. No ejecutar backups/restores ni heredar garantías de producción en esta auditoría.

**Riesgo de ciclo de vida de aula.** `ShowStudentApp.tsx` carga el DTO y programa su expiración local; no se observa polling de revocación en ese componente. Aunque el servidor invalide futuros accesos, una vista ya cargada puede seguir visible hasta expirar. V2 debe verificar retirada manual, logout y cambio de grupo de extremo a extremo; no basta con probar que una nueva petición al servidor falla.

**Validación ejecutada durante esta auditoría.** En Node 22.23.3, Vitest 3.2.4 completó **21 archivos y 95 pruebas, todas aprobadas**, con dos workers. Selección: `packages/domain/test`; RT dominio/servicio; comportamiento dominio/frontera; leases y rutas de proyección; compositor narrativo; narrativa dominio/servicio; rutas de rúbrica; privacidad de proyección/cierre; coins solo lectura; búsqueda, RT grid, XP pendiente y deshacer en web. Se usó el runner existente, sin añadir ni modificar pruebas.

La instalación inicial necesitó caches escribibles en `/tmp`. Un intento con Node 24 se interrumpió en código nativo SQLite; el cambio a Node 22 y la reconstrucción del binding resolvieron la ejecución seleccionada. Estos fallos de entorno no se clasifican como bugs de producto. La instalación mantuvo lockfile congelado y verificación de integridad. El checkout de referencia terminó sin cambios versionados o archivos sin seguimiento.

No se ejecutaron la suite completa, Playwright, build/typecheck, despliegue o restauración. Los resultados validan la selección anterior en esta copia y revisión; no demuestran seguridad completa, UX en aula ni readiness de producción. La recomendación REUSE requiere volver a ejecutar las pruebas pertinentes al adaptar cada módulo a V2.

## 2. Matriz de reutilización

REUSE preserva lógica y semántica; ADAPT conserva el propósito con nuevos límites o interfaces; REBUILD reconstruye la experiencia; DROP excluye del diseño nuevo; DEFER pospone trabajo necesario. La inspección fundamenta estas recomendaciones; las decisiones finales de port requieren pruebas de compatibilidad con V2.

| Módulo o capacidad | Decisión | Condición y motivo |
| --- | --- | --- |
| Reglas XP, categorías, especialidades y bonus | REUSE | Conservar fórmulas comprobadas; XP sigue siendo evidencia, nunca nota oficial. |
| RT, medias, Energy y rachas | ADAPT | Reutilizar cálculos de `rt/domain.ts`; resolver ABSENT/pendiente y corrección antes de adaptar contrato/persistencia. |
| Reglas de comportamiento | ADAPT | Reutilizar estados y trazabilidad; resolver acoplamiento bonus/XP efectivo sin penalización académica. |
| Gems y transacciones | ADAPT | Mantener Emerald/Ruby/Diamond; aislar lectura de coins en migración. Verificar integridad y correcciones. |
| Evaluación, cierre y reapertura | REUSE | Preservar snapshots inmutables y reapertura explícita y trazable. |
| Tests de dominio, autorización y leakage | REUSE | Ejecutarlos y conservar su significado; adaptar fixtures/interfaces cuando corresponda. |
| Grupos, alumnos, años y especialidades | ADAPT | Aprovechar modelos sin heredar acoplamiento con la UI anterior. |
| API, persistencia y repositorios de datos | ADAPT | Separar comandos por dominio y contratos profesor/aula. Stack pendiente de evidencia. |
| Autenticación docente | ADAPT | Conservar mecanismos seguros verificados; solo acceso docente. |
| Contratos seguros de proyección | ADAPT | Reutilizar allowlist y leases; revisar campos individuales y excluir comportamiento privado del DTO V2. |
| Historial, correcciones y exportación | ADAPT | Mantener trazabilidad y exportación privada; presentación contextual. |
| Lógica narrativa estable | REUSE | Progreso colectivo sin efectos automáticos sobre otros dominios. |
| Frontend, navegación y componentes | REBUILD | Optimizar uso en directo en portátil/tablet. |
| Proyección, Show Student y narrativa visual | REBUILD | Experiencias específicas con contenido seguro y jerarquía propia. |
| Seed y demo | ADAPT | Datos sintéticos reproducibles; ningún dato real de alumnado. |
| Compatibilidad visual y abstracciones sin uso en V2 | DROP | No forman parte del alcance nuevo; no implica borrar el repositorio anterior. |
| Operación incompleta del legado | DROP | No trasladarla como garantía de producción. |
| Importador y migraciones de datos | DEFER | Diseñar en N6 tras verificar formatos; reutilizar transformaciones probadas donde sirvan. |
| Hardening, backup/restore y retención | DEFER | Obligatorios antes de producción; demostrar en V2 durante N7. |

Evidencias principales para ejecutar el port:

| Área | Código de referencia | Pruebas candidatas |
| --- | --- | --- |
| XP y evaluación | `packages/domain/src/xp/`, `packages/domain/src/rubric/`, `apps/api/src/xp/`, `apps/api/src/rubric/` | `packages/domain/test/{xp,rubric}.test.ts`, `rubric/routes.integration.test.ts` |
| RT y comportamiento | `apps/api/src/rt/`, `apps/api/src/behaviour/` | `rt/domain.test.ts`, `rt/service.test.ts`, `behaviour/domain.test.ts`, `behaviour/routes.integration.test.ts` |
| Aula y Show Student | `apps/api/src/projection/`, `apps/api/src/server.ts` | `test/privacy/projection.test.ts`, `projection/lease-registry.test.ts`, `projection/routes.integration.test.ts` |
| Narrativa | `apps/api/src/narrative/`, `projection/narrative-composer.ts` | `narrative/{domain,service}.test.ts`, `projection/narrative-composer.test.ts` |
| Historial, economía y cierre | `apps/api/src/history/`, `gems/`, `term-close/`, `coins/` | `history/boundary.test.ts`, `test/integration/coins-readonly.test.ts`, `test/privacy/term-close-boundary.test.ts` |
| Interacción docente | `apps/web/src/workspace/` | `search.test.ts`, `RtGrid.test.ts`, `StudentPanel.xp-pending.test.tsx`, `UndoBanner.test.tsx` |

## 3. Cinco fricciones prioritarias y cambios funcionales

Priorización basada en brief e inspección estática: tres activaciones para XP; cuadrícula RT con guardados individuales; módulos secundarios por delante del roster y monedas legado dentro del panel; salida de aula con varios contratos; correcciones/contexto entre dominios. La frecuencia y gravedad siguen siendo hipótesis que deben medirse con docentes. La mezcla de idioma atraviesa los cinco problemas: toda la UI nueva será española.

| Problema a validar | Comportamiento propuesto | Beneficio | Invariante y riesgo |
| --- | --- | --- | --- |
| XP exige alumno → categoría → valor; el texto “Un toque” no describe todo el flujo | Grupo persistente, búsqueda local y panel rápido; acción frecuente visible con categoría y valor explícitos | Reducir navegación y volver inmediatamente al grupo | No inventar valores/bonus. Riesgo de alumno equivocado: identidad docente clara y feedback con destinatario. |
| La cuadrícula RT guarda cada alumno por separado pese a existir API de lote | Cuadrícula de sesión con controles 10/5/0/no evaluado, resumen y guardado del lote | Registrar una clase con un guardado explícito | Vacío permanece no evaluado; nunca equivale a cero. Riesgo de lote accidental: revisar cantidades y permitir corrección trazable. |
| Competencia visual entre evaluación, juego y disciplina | Workspace centrado en acciones; detalles en secciones explícitas del panel | Menor carga durante clase | Ningún indicador combinado de rendimiento. Comportamiento no modifica XP, notas, RT o Energy. |
| Miedo a exponer información privada al proyectar | Vista de aula independiente, contrato seguro y Show Student deliberado y temporal | Poder proyectar sin navegar por información privada | Filtrar antes de entregar datos al cliente de aula. Riesgo de datos viejos: expirar y limpiar selección, incluida desconexión. |
| Interrumpir la clase para corregir o gestionar narrativa | Feedback con deshacer; historial contextual; narrativa en espacio colectivo opcional | Recuperarse de errores y controlar tiempo narrativo | Deshacer conserva auditoría y aplica reglas del dominio; narrativa no concede ni retira recursos automáticamente. |

## 4. Tres direcciones de producto y visuales

| Dirección | Experiencia y lenguaje visual | Ventaja | Riesgo |
| --- | --- | --- | --- |
| Mesa docente | Superficies claras, filas compactas, encabezado de grupo estable, panel lateral; acentos discretos | Rapidez, legibilidad y buen uso de tablet | Exceso de densidad si todos los indicadores aparecen a la vez. |
| Cuaderno de clase | Lista y registro cronológico como eje; tipografía editorial, separadores y pocos bloques | Seguimiento y evaluación contextual | Historial puede desplazar las acciones frecuentes. |
| Estación Éclipse | Superficies oscuras, alto contraste, identidad tecnológica y narrativa visible | Personalidad y proyección inmersiva | Juego puede dominar la herramienta docente; más difícil mantener discreción de estados. |

## 5. Dirección recomendada

Elegir Mesa docente para el profesor. Usar una expresión visual propia de Éclipse en la proyección y narrativa, conservando controles accesibles y estados explícitos.

En portátil: navegación estable, grupo y búsqueda arriba, listado central y panel rápido lateral que preserve contexto. En tablet: panel amplio superpuesto con regreso al mismo alumno y posición del listado. En móvil: acciones esenciales y una columna; no diseñar una app nativa.

Tipografía de sistema legible, contraste AA, foco visible, targets táctiles de al menos 44 px como objetivo de diseño y animaciones breves respetando movimiento reducido. Color acompañado de texto/icono. Evitar gradientes decorativos, tarjetas repetidas sin jerarquía y números gamificados dominantes. Los estados de comportamiento solo aparecen en la vista privada donde sean necesarios.

## 6. Arquitectura de información y límites técnicos

```text
Acceso docente
└── Espacio docente [año y grupo activos]
    ├── En clase [entrada predeterminada]
    │   ├── Buscar / seleccionar alumno
    │   ├── Panel rápido y acción XP
    │   └── Registro RT masivo por tarea
    ├── Seguimiento
    │   ├── Historial y correcciones
    │   ├── Tareas / RT
    │   ├── Comportamiento privado
    │   └── Gamificación / Gems / recompensas
    ├── Evaluación
    │   └── Rúbrica / ajuste / cierre / reapertura / exportación
    ├── Narrativa [grupo, opcional]
    └── Configuración [grupos, alumnado, año y reglas explícitas]

Salida de aula independiente
├── Pantalla neutra / contenido seguro del grupo
├── Show Student [temporal]
└── Narrativa colectiva segura
```

Proyectar es una acción persistente del shell docente que abre/controla una salida de aula separada. No transforma el workspace privado en una pantalla pública. La proyección no recibe el objeto docente completo ni almacena datos privados para ocultarlos después.

Componentes prioritarios: AppShell, GroupSwitcher, StudentRow/Card, StudentQuickPanel, QuickAction, BulkRTGrid, StatusChip, FeedbackUndo, ProjectionCanvas, ShowStudentCard y NarrativeEventCard. Separar componentes de presentación de comandos/reglas de dominio.

Límites lógicos propuestos, sin elegir framework: identidad docente; grupos/alumnos; observaciones XP; tareas RT; gamificación y economía; comportamiento; evaluación; narrativa; historial; y publicación de aula. Un comando declara su dominio y sus efectos autorizados. Las dependencias permitidas se documentan y prueban; no se elimina la relación existente entre observaciones y sugerencias de evaluación, pero toda nota requiere juicio docente.

La capa autoritativa produce un contrato de aula con lista explícita de campos permitidos. Como base conservadora del prototipo: alias, avatar sintético y contenido colectivo expresamente preparado para aula. No incluir nota, RT exacto, rúbrica, comentarios, incidentes, historial detallado o disciplinario. XP/Energy/Gems/nivel individuales no se publican por defecto hasta aprobar su clasificación; nunca se usan para ranking público. El cliente de aula tiene su propio contrato, autorización y ciclo de vida. Identificadores de conexión no deben permitir consultar endpoints privados.

## 7. Flujos clave

### Profesor: acción XP frecuente

1. Acceder como docente y elegir grupo; mantener el contexto visible.
2. Encontrar alumno por listado o búsqueda privada.
3. Abrir panel y ejecutar una acción frecuente con categoría y valor visibles; sin comentario obligatorio.
4. Mostrar destinatario, resultado y deshacer; conservar el grupo y foco para seguir dando clase.

Objetivo: dos activaciones desde un alumno visible para una acción configurada, sin contar login, selección inicial de grupo o texto de búsqueda. Acciones no configuradas pueden requerir elegir categoría. No asignar XP con una categoría o cantidad implícita.

Errores: conservar intención sin mostrar éxito falso; evitar doble envío; ofrecer reintento cuando sea seguro. Correcciones se registran, no borran silenciosamente el historial. La reversión de efectos derivados depende de reglas verificadas en el legado.

### RT masivo

Elegir sesión/tarea contextual → abrir cuadrícula del grupo → registrar 10/5/0 o dejar no evaluado → revisar resumen de pendientes y registros → guardar → confirmar resultados → corregir si procede. En una sesión nueva todos empiezan no evaluados; al reabrir se conservan los registros existentes. Ningún guardado convierte pendientes en cero. Distinguir lote pendiente, confirmado y fallido. Reutilizar el lote transaccional e idempotente existente para guardar todo o nada; ante respuesta perdida, reintentar con la misma clave. Conservar sesiones finalizadas en solo lectura. No introducir un nuevo modelo de tareas desligado del calendario ni permitir borrar un valor guardado hasta resolver el contrato de corrección.

### Proyección

Abrir salida de aula en estado neutro → ver previsualización segura en controles privados → publicar contenido permitido → retirar contenido o terminar. El docente mantiene sus controles en una pantalla privada. Si comparte la pantalla completa del dispositivo, el software no puede ocultar los controles privados: el uso previsto requiere seleccionar la ventana/pantalla de aula al proyectar.

La salida nunca carga datos docentes. Desconexión, expiración o pérdida de autorización vuelven a una pantalla neutra; no dejan una selección individual visible indefinidamente. No hay clasificaciones públicas ni ordenación por rendimiento.

### Show Student

Desde panel privado → previsualizar alias/avatar seguros → confirmar “Mostrar en aula” → visualizar temporalmente → retirar manualmente o al expirar → volver al estado neutro. Cambiar grupo o cerrar la sesión retira la selección. Conservar inicialmente el TTL existente de 120 segundos, sin renovación automática; evaluar su adecuación en clase sin cambiar la política por motivos visuales.

### Narrativa

Abrir narrativa del grupo → ver evento bloqueado/disponible/completado → consultar reto o pista → realizar transición docente permitida → publicar versión colectiva segura si se desea. No dispara comandos de XP, RT, notas, Energy, comportamiento o Gems. Puede estar desactivada sin degradar el núcleo docente.

### Evaluación futura

Revisar evidencia privada → ajustar rúbrica con juicio docente → cerrar explícitamente → consultar snapshot estable. Reapertura como acción separada, confirmada y auditada. No incluir la implementación en el primer prototipo.

## 8. Prototipo pequeño y validación

Datos sintéticos: un docente demo, dos grupos, un grupo de aproximadamente 30 alumnos con alias/avatar, una tarea RT y un evento narrativo. Sin importar alumnado real. El login es una simulación claramente señalada, no autenticación de producción.

| Pantalla/flujo | Alcance navegable | Estados necesarios |
| --- | --- | --- |
| Login | Entrada demo y retorno al grupo | Vacío, error y acceso correcto |
| Workspace de grupo | Cambio de grupo, búsqueda y listado | Sin resultados, carga y grupo vacío |
| Panel rápido | Identidad privada y secciones separadas | Abierto/cerrado, alumno distinto |
| Acción XP | Una categoría y acción demo explícitas | Pendiente, éxito, error y deshacer |
| RT masivo | Una tarea y 30 registros | No evaluado, 10/5/0, revisión y corrección |
| Proyección | Salida independiente con contenido seguro | Neutro, activo y desconectado |
| Show Student | Previsualización y publicación temporal | Confirmación, expiración y retirada |
| Narrativa | Un evento, reto/pista y progreso colectivo | Bloqueado, disponible y completado |

El prototipo solo valida navegación y comportamiento simulado. Su adaptador de datos de aula debe construir un modelo permitido independiente para detectar filtraciones de diseño; esto no sustituye API autoritativa, autorización o pruebas de seguridad del producto funcional.

Criterios propuestos de aceptación:

- Docentes completan encontrar alumno → registrar XP → continuar sin ayuda y sin perder grupo; registrar activaciones, tiempo, errores y correcciones. Meta inicial: hasta dos activaciones para la acción frecuente desde alumno visible.
- Completar RT de 30 alumnos sin abrir paneles individuales; pendientes siguen no evaluados y quedan fuera de la media. No fijar una fórmula demo diferente de la regla existente.
- Deshacer una acción afecta al alumno correcto y mantiene una explicación del cambio.
- Proyección y Show Student nunca reciben campos privados en sus fixtures/estado; retirada y expiración funcionan. Verificar red/almacenamiento cuando exista la implementación funcional.
- Cambiar grupo o desconectar no conserva Show Student; narrativa no modifica otros dominios.
- Flujo principal usable por teclado y tablet; foco, contraste y estados comprensibles sin depender de color. Comprobar legibilidad de aula en condiciones reales de proyección.

Excluir de este prototipo: persistencia productiva, economía completa, importación, evaluación completa, cuentas reales, administración empresarial y operaciones de producción. Las reglas excluidas no se declaran verificadas.

## 9. Plan de implementación posterior

1. **N0: cerrar decisiones de compatibilidad.** Partir de esta auditoría en la revisión fijada; resolver RT/ABSENT, bonus y clasificación de campos de aula. Completar cualquier evidencia adicional necesaria para el módulo elegido antes de portarlo.
2. **Fase A: prototipo N1 con muestras de N2/N3/N5.** Construir únicamente las ocho experiencias enumeradas, datos sintéticos y estados de fallo. La presencia temprana de proyección permite validar la frontera antes de ampliar la UI.
3. **Validar el flujo docente.** Observar tareas en portátil/tablet, corregir problemas de navegación y privacidad, y acordar criterios de salida. No expandir por mera completitud visual.
4. **Fase B: núcleo funcional N2–N5.** Portar reglas y tests verificados; implementar comandos, persistencia, auth y contrato seguro de aula. Añadir evaluación con snapshots y economía con integridad. Probar autorización, leakage, duplicados, correcciones y aislamiento de narrativa/comportamiento.
5. **Fase C: N6.** Importador explícito con validación, reporte de incompatibilidades y pruebas sobre copias seguras. No inventar conversión coins→Gems ni alterar snapshots históricos.
6. **Fase D: N7.** Hardening y operación con evidencia propia: privacidad, retención/borrado, backup y restauración probada, observabilidad, accesibilidad, rendimiento y despliegue. Ninguna afirmación de readiness productiva se hereda del legado.

Recomiendo conservar inicialmente TypeScript, React/Vite, Fastify, SQLite/Drizzle, contratos Zod y Vitest/Playwright: el código de referencia ya utiliza límites compatibles y aporta pruebas reutilizables. Reconstruir la UI no exige cambiar persistencia o framework. Confirmar versiones soportadas y adaptar interfaces al iniciar el núcleo funcional; alojamiento y operación productiva se deciden con requisitos de despliegue reales.

## 10. Preguntas que requieren al mantenedor

**Referencia ya resuelta:** Riroma13/EclipseGames, main, commit `7ea70f9f2a4d023bf335147c184cbe3c6dfa3e1f`.

**Antes de portar XP/comportamiento:** ¿el bonus de especialidad del legado es estrictamente gamificado y puede seguir condicionado por comportamiento, o se considera parte de la evidencia XP protegida en V2? La propuesta preserva XP base y no autoriza un cambio silencioso de esta regla.

**Antes de portar RT:** ¿“Ausente” debe conservarse como estado distinto de “no evaluado”? Ambos quedan fuera de la media, pero no se deben colapsar datos históricos ni introducir una acción de borrado sin trazabilidad.

**Antes de validar publicación individual en aula:** ¿qué campos individuales, además de alias/avatar, están explícitamente autorizados como classroom-safe? La propuesta mantiene fuera todos los indicadores individuales no clasificados.

**Antes de cerrar el prototipo:** ¿la proyección habitual se realiza en segunda pantalla, ventana compartida o un dispositivo separado? Esto determina los controles y la validación de uso real; el contrato seguro permanece igual.

**Antes de N6, si la auditoría no aporta una regla canónica:** ¿existe una conversión aprobada de coins a Emerald/Ruby/Diamond o debe conservarse únicamente el dato legado para consulta? No asignar equivalencias por diseño.

El resto son decisiones propuestas para probar, no preguntas que bloqueen el trabajo conceptual. La implementación completa permanece fuera de esta entrega.
