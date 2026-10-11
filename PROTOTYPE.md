> Actualización: Atlas es la dirección elegida. La entrada `/` tiene autenticación, grupos, panel rápido y XP base, sesiones y RT persistentes; su alcance y arranque están en [BACKEND.md](BACKEND.md). Este documento describe las **demos visuales** de `/?gallery=1` y `/?design=atlas`, que continúan en memoria.

# EclipseGames — prototipo navegable 0.2

Consultar [las correcciones aportadas](docs/corrections/README.md) antes de ampliar esta entrega. La versión 0.2 representa los módulos principales con interacciones demo. Las iniciales docentes y los avatares vectoriales de aula son placeholders del catálogo 3D cinematográfico final.

Primer recorrido: acceso demo → grupo → buscar alumno → ficha privada → registrar XP base → deshacer. Dos grupos de 30 alumnos sintéticos, sin rankings. XP por Comunicación, Precisión, Constancia y Colaboración, con valores explícitos 1/2/3; no se calcula bonus ni nota. Deshacer conserva el evento marcado como corregido en el historial demo.

## Ejecutar

Node 22.12 o superior (validado en Node 24.19.0). Desde la raíz de EclipseGames-v2:

```sh
npm ci
npm run dev
```

`npm run build` genera `dist`. `npm run preview` sirve esa compilación. Utilizar el checkout existente; no hace falta un worktree.

## Validar

```sh
npx playwright install chromium
npm test
```

Las pruebas usan el servidor Vite en el puerto 5173. Verifican registro, bloqueo durante carga, fallo simulado sin mutación, reintento, deshacer, aislamiento entre grupos, búsqueda por acentos, navegación por teclado y viewport tablet/móvil.

Si ya hay Chromium instalado, se puede utilizar sin descargar otro navegador: `CHROMIUM_PATH=/usr/bin/chromium npm test` (Linux). La compilación del prototipo conserva el grafo de módulos de React y minifica la salida; revisar optimización de módulos al preparar la aplicación funcional.

“Herramientas de prueba” permite fallar el próximo registro. El fallo no suma XP. Las acciones tardan 500 ms para poder observar el estado pendiente. Ctrl/Cmd K enfoca la búsqueda; Escape cierra la ficha y devuelve el foco a su origen.

## Límites

Acceso simulado, sin cuentas ni backend. Estado en memoria: recargar o salir reinicia registros; no introducir datos reales. La política de bonus condicionado por comportamiento permanece pendiente. Una representación frontend no sustituye contratos autoritativos, autenticación, persistencia, autorización o validación con docentes.

## Cobertura visual de los documentos

### Comparador de cuatro diseños

La entrada abre un catálogo con Mesa docente, Cuaderno de campo, Signal Éclipse y Atlas de clase. Cambian paleta, tipografía y disposición de navegación/listado; comparten los mismos flujos y restricciones. `?design=mesa`, `?design=cuaderno`, `?design=signal` y `?design=atlas` abren cada variante. El selector superior conserva la sesión al cambiar de variante; regresar al catálogo reinicia la demo.

`npm run export:demo` genera `deliverables/EclipseGames-cuatro-disenos.html`, un archivo autónomo con React, estilos y fondo SVG incorporados. No requiere npm ni servidor para el usuario: descargar y abrir en un navegador moderno. No se publican credenciales o datos personales. El archivo generado está excluido de Git; el script reproduce la entrega.

La entrega autónoma se comprobó sirviendo únicamente ese HTML: catálogo, login, registro XP, cambio de diseño y Modo Aula funcionaron sin errores de JavaScript ni peticiones a assets externos. La navegación directa con `file://` no pudo verificarse en el navegador administrado de este entorno; el archivo no depende de recursos remotos.

| Módulo | Lo que se puede recorrer | Pendiente para la aplicación funcional |
| --- | --- | --- |
| Acceso, grupos y XP | Dos grupos de 30 alumnos, búsqueda, categorías canónicas, descriptores en los botones XP, carga/error/reintento y corrección | Auth real, importación, edición del roster y política de bonus |
| Sesiones y RT | Inicio/fin manual con hora real; sesiones RT separadas; orden por apellidos, búsqueda, selector 10/5/0/A, asignar 10 al grupo, guardar/deshacer | Persistencia, histórico de medias/Energy/rachas y correcciones autoritativas |
| Evaluación | Matriz ancha con descriptores aportados, selección docente, comentario, resultado demo, cierre confirmado, snapshot conservado y reapertura con motivo; exportación JSON de muestra | Validación de fórmula, agregación de evidencia y exportación productiva |
| Avatares y Gems | Apariencias base SVG, boutique, compra/equipamiento, propiedad sin doble cobro, reversión, pendientes sin cobro, timeline de niveles; apertura/cierre/expiración de acceso temporal y preview del Atelier | Assets 3D, catálogo completo, desbloqueos automáticos, compra transaccional por lotes y seguridad del acceso individual |
| Retransmisiones | Nueve escenas, candados, fecha y desbloqueo manual; escena simulada antes de VER DESAFÍO; completar y revisar | Vídeos/retos oficiales, almacenamiento y reglas exactas de programación |
| Organización | Sorteo de alias/avatar; generar equipos por cantidad o tamaño, volver a sortear y mantener | Persistencia durante sesiones reales |
| Aula y Show Student | Escenografía vectorial de isla, desafío izquierdo, agentes centrales y señales derechas; solo alias/apariencia, vista temporal 120 s y retirada manual | DTO/API seguros, conexión de pantalla independiente, assets definitivos y evaluación de legibilidad en aula |
| Historial y comportamiento | Historial por dominio, incidencias privadas, estados independientes de XP/notas/RT/Gems | Trazabilidad durable, vidas, restricciones y propuestas disciplinarias verificadas |
| Configuración | Listado privado del grupo, información de privacidad y acceso a personalización | CRUD de curso/grupos/alumnos, proveedores y configuración productiva |

No se presentan como implementadas todas las reglas de los DOCX. Precios, saldo inicial de 4 Esmeraldas y escenas son muestras explícitas. Los alumnos demo están en Nivel 1; registrar XP base no activa fórmulas de progresión todavía. Los campos disciplinarios no se proyectan.

## Evidencia de esta entrega

`npm run build` completado. Las trece pruebas Playwright aprobaron utilizando Chromium del sistema: los ocho recorridos de producto anteriores y cinco verificaciones del comparador/cambios de diseño y de los cuatro layouts en móvil. No equivalen a una evaluación completa de accesibilidad ni a validación con docentes en clase.
