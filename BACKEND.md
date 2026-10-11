# Atlas · grupos, XP y RT persistentes

La entrada `/` utiliza Atlas de clase y acceso docente real. El catálogo visual permanece en `/?gallery=1` y las demos en `/?design=atlas` (o mesa/cuaderno/signal). Estas demos siguen usando datos ficticios en memoria y no leen la base de datos.

## Arranque local y en este entorno

Requiere Node 24 (SQLite incorporado), npm y dos procesos:

```sh
npm ci
npm run api
# En otra terminal, desde el mismo checkout:
npm run dev -- --port 5173 --strictPort
```

Vite sirve el frontend y envía `/api` al servidor local en el puerto 3001. `GET /api/health` comprueba disponibilidad. `npm run preview` sirve únicamente el bundle: no configura la API.

Crear la primera docente antes de entrar: establecer `ECLIPSE_TEACHER_EMAIL` y `ECLIPSE_TEACHER_PASSWORD` en el entorno del proceso, con una contraseña propia de al menos 12 caracteres, y ejecutar `npm run teacher:create`. No guardar ni compartir su valor en el repositorio o el chat. `npm run teacher:create -- --demo` añade dos grupos ficticios de 30 alumnos; sin esa opción se entra sin grupos y se crean desde la interfaz. El comando rechaza correos ya existentes y no cambia contraseñas.

No se han creado credenciales de acceso permanentes durante el desarrollo. Las pruebas generan contraseñas aleatorias y eliminan sus bases temporales.

## Alcance

- Autenticación docente con contraseña derivada con scrypt y cookie HttpOnly, SameSite Strict, caducidad de ocho horas y cierre de sesión que revoca el token en servidor. Token almacenado solo como hash. Límite de intentos por IP en memoria; no distribuido.
- Grupos privados por docente, creación con lista de nombres (una línea por alumno) y alias automáticos. No hay cuentas de alumnado ni inscripción pública. Edición/importación avanzada pendientes.
- Sesiones manuales con horas del servidor, una sesión activa por grupo, consulta de sesiones anteriores y fin explícito. No dependen de horarios.
- En clase · XP: buscar por nombre/alias, abrir ficha privada y registrar Comunicación, Precisión, Constancia o Colaboración con valores base 1/2/3 y descriptores explícitos. Cada observación conserva alumno, grupo, docente y fecha del servidor. No requiere una sesión RT activa ni calcula nota, bonus, nivel, gemas, Energy o cambios de comportamiento.
- Correcciones XP: deshacer conserva la observación original y añade autor/fecha de reversión. La API hace idempotente el reintento de la misma acción y la reversión repetida; el frontend bloquea doble pulsación y conserva el identificador de una petición no confirmada mientras permanece en el espacio docente, incluso al cambiar de sección. No cubre reintentos tras cerrar/recargar la página antes de confirmar la operación: consultar historial antes de repetir en ese caso.
- Guardar XP actualiza únicamente sus observaciones en la interfaz: un borrador RT pendiente se conserva al cambiar de sección y registrar XP.
- RT masivo: asignar 10 a todos, corregir excepciones, guardar lote y deshacer el último guardado. Cambios sin guardar se señalan y se confirma su descarte al cambiar de grupo/sesión o salir.
- Valores 10, 5, 0, A y No evaluado. A y No evaluado son distintos y quedan fuera de la media RT visual. No se escribe Energy ni rachas; su implementación posterior deberá respetar que ausencia no las penaliza.
- Transacción atómica, validación de pertenencia de todos los alumnos y control de versión: una pestaña con datos antiguos recibe conflicto sin sobrescribir registros nuevos. Actualizar permite recuperar la versión vigente.
- Historial RT conserva antes/después, docente, hora y tipo de operación. Deshacer añade una corrección; no borra la evidencia del guardado. Sesiones cerradas son solo lectura en esta fase.

## Datos y alojamiento

La base predeterminada es `data/eclipse.sqlite`, ignorada por Git. `ECLIPSE_DB` permite indicar otra ruta; el directorio y las tablas se crean automáticamente sin borrar datos. No borrar `data/` al actualizar. Para backups consistentes de esta fase, detener la API antes de copiar el directorio completo (incluido WAL si existe). No copiar solo el archivo principal mientras haya escrituras.

Este servidor es una primera implementación local, no un despliegue de producción. Escucha en loopback. Producción requiere HTTPS, almacenamiento duradero, backups probados, gestión de credenciales/recuperación, límites de acceso operativos y revisión de seguridad. `NODE_ENV=production` activa Secure en la cookie; `ECLIPSE_ORIGIN` indica el origen permitido para escrituras detrás de un proxy del mismo sitio. El límite de login usa IP del socket, sin confiar en cabeceras de proxy.

No publicar SQLite en almacenamiento efímero de funciones Vercel. Vercel puede servir el frontend, pero necesitará una API con almacenamiento duradero o una adaptación explícita de persistencia; esa decisión queda para despliegue. No se ha publicado esta versión.

Evaluación, comportamiento, gemas, avatares y narrativa no están conectados a esta API. La proyección funcional tampoco está habilitada: el prototipo visual usa exclusivamente datos ficticios. Antes de proyectar datos persistidos se creará un endpoint con lista explícita de campos seguros. El arte puede sustituirse posteriormente sin modificar RT ni autenticación.

## Validación

```sh
npm run test:api
CHROMIUM_PATH=/usr/bin/chromium npm test
npm run build
```

Las pruebas de API usan una base temporal, reinician el servidor y verifican persistencia, autenticación, aislamiento docente/grupo, rechazo de origen externo, valores inválidos, conflictos, deshacer y bloqueo de sesiones finalizadas. Las pruebas XP verifican valores/categorías, aislamiento docente y alumno, reintentos idempotentes, correcciones sin borrar originales, conservación de RT y actualización de una base anterior. Playwright cubre panel rápido, búsqueda por alias, doble pulsación, pérdida de respuesta después de guardar, reintento y borrador RT pendiente, además de recarga, cierre de sesión, lotes RT, historial de sesiones, confirmación de descarte, búsqueda en tablet y creación de grupos, además de las demos existentes. Las pruebas de navegador arrancan su propia API temporal en 3001: detener la API de desarrollo antes de ejecutarlas.

## Cambios funcionales y sus límites

| Problema actual | Comportamiento propuesto e implementado | Beneficio | Invariante / riesgo |
| --- | --- | --- | --- |
| Recargar pierde sesiones y RT de la demo | Guardar en SQLite con sesiones identificadas y consulta histórica | Retomar la clase y revisar tareas | RT independiente; almacenamiento local requiere backups y alojamiento duradero |
| Acceso simulado no protege datos reales | Cookie docente y control de propiedad de grupo en API | Separar información privada de cada docente | Sin cuentas de alumnado; no ofrece datos persistidos a proyección |
| Lote en memoria sin control entre pestañas | Transacción y versión obligatoria, corrección auditada | Evitar sobrescrituras silenciosas y corregir errores | Mantiene 10/5/0/A/No evaluado; no calcula ni cambia XP, notas, comportamiento, Energy o rachas |
| Docente sin grupos asignados no puede empezar | Crear grupo y pegar lista de nombres; alias automático | Empezar sin editar la base a mano | Nombres privados; modificación y eliminación de alumnos quedan pendientes |
| XP en memoria desaparece al recargar | Observaciones persistentes y correcciones separadas; acciones base 1/2/3 | Encontrar alumno, registrar evidencia y continuar la clase | Sin bonus inferido ni cálculos académicos; API privada; no hay ranking público |

## Actualizar desde la entrega anterior en Windows

Detener ambos servicios con Ctrl+C. Extraer `EclipseGames-Atlas-XP-actualizacion.zip` encima del checkout con `Expand-Archive -Force`, sin borrar carpetas. El ZIP incluye solo código/documentación; no incluye `data/`, `.git`, credenciales ni dependencias. No recrear la docente. Las tablas XP se añaden al iniciar la API, conservando datos anteriores; la actualización se prueba sobre una base con grupos y RT existentes.

Desde la misma carpeta, en dos ventanas de PowerShell: `npm.cmd run api` y `npm.cmd run dev -- --port 5173 --strictPort`. No hay dependencias nuevas para esta actualización. Abrir la entrada local habitual y seleccionar grupo: En clase · XP es la sección predeterminada; Tareas · RT conserva el flujo anterior.
