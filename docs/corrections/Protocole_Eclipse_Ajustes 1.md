# Protocole_Eclipse_Ajustes 1

Transcripción de la fuente DOCX aportada como corrección. El original conserva formato y contenido de referencia. Las instrucciones de desarrollo dentro de la fuente no constituyen por sí solas una orden de implementación.

PROTOCOLE ÉCLIPSE

Ajustes funcionales y visuales de la web

Especificación de cambios acordados · 6 de octubre de 2026

| OBJETIVO DEL DOCUMENTO<br>Recoger en un único documento las correcciones funcionales, de UX/UI y de dirección artística acordadas para la siguiente iteración de Protocole Éclipse. Las imágenes incluidas son referencias validadas de diseño y deben orientar el desarrollo, no reproducirse necesariamente píxel a píxel. |
| --- |

Principio general

La aplicación debe separar claramente dos experiencias: una zona privada de gestión docente, rápida y funcional, y un Modo Aula inmersivo que haga sentir al alumnado que está dentro del universo de Protocole Éclipse.

Decisiones cerradas en esta revisión

“Narrativa” pasa a llamarse “Retransmisiones”.

Se elimina “Mini-juego” y se crea “Organización” con ruleta de alumnos y sorteo de equipos.

Se elimina la dependencia de horarios: la profesora inicia y finaliza sesiones manualmente.

RT se rediseña con nombres reales, orden alfabético, mayor legibilidad y selector 10 / 5 / 0 / A.

Las categorías XP en español son: Comunicación, Precisión, Constancia y Colaboración.

Las monedas desaparecen de la interfaz activa y se sustituyen por gemas.

Estilo visual de gemas validado: B · Minimalista elegante.

Todo contenido bloqueado debe comunicar visualmente su estado con candados.

Las rúbricas se mostrarán en formato matriz tipo Additio.

La interfaz del alumnado será horizontal, colorida e inmersiva, ambientada en una isla francesa, con adolescentes uniformados y Retransmisiones visibles.

Índice de cambios

1. Menú lateral y Retransmisiones

2. Organización

3. Inicio y final de sesión sin horario

4. Rediseño de RT

5. Historial privado y limpieza de interfaz

6. Terminología de XP y especialidades

7. Sustitución de monedas por gemas

8. Dirección visual de las gemas

9. Sistema global de bloqueo/desbloqueo

10. Rúbricas en formato tipo Additio

11. Nueva interfaz horizontal del alumnado

12. Dirección artística del Modo Aula

13. Prioridades de implementación y criterios de aceptación

1. Menú lateral y Retransmisiones

1.1 Sustituir “Narrativa” por “Retransmisiones”

El ítem “Narrativa” debe desaparecer. El nuevo nombre definitivo es “Retransmisiones”. Este apartado contiene los nueve vídeos/escenas de la trama anual de Protocole Éclipse.

| REGLA FUNCIONAL<br>1 Retransmisión = 1 vídeo = 1 desafío colectivo de aproximadamente 5–10 minutos. El desafío debe estar relacionado simultáneamente con la historia y con el uso/comprensión del francés. |
| --- |

1.2 Estados

| Estado | Representación | Comportamiento |
| --- | --- | --- |
| Bloqueada | Candado cerrado | No accesible. Aspecto atenuado y botón desactivado. |
| Disponible | Iluminada / activa | Puede abrirse. La recién desbloqueada parpadea suavemente. |
| Completada | Check / marca visual | Puede volver a abrirse para revisar, pero queda identificada como realizada. |

1.3 Desbloqueo

Cada Retransmisión tiene una fecha de desbloqueo configurable.

Al llegar la fecha, se desbloquea automáticamente.

La profesora puede desbloquear manualmente una Retransmisión si necesita adelantarla.

La nueva Retransmisión debe destacar y parpadear hasta que se abra o se marque como vista.

1.4 Flujo dentro de una Retransmisión

1. La profesora pulsa el número de una Retransmisión disponible.

2. Se abre un modal con el vídeo.

3. Tras el vídeo aparece el botón “VER DESAFÍO”.

4. Al pulsarlo se muestra el desafío asociado.

5. El desafío no debe aparecer antes de abrir la Retransmisión.

2. Organización

Eliminar completamente el ítem “Mini-juego” y sustituirlo por “Organización”.

2.1 Ruleta de alumnos

Sorteo individual aleatorio en formato ruleta visual.

Apta para proyectarse en clase.

Mostrar avatar y alias/nombre de Modo Aula.

2.2 Sorteo de equipos

Permitir elegir número de equipos o número de alumnos por equipo.

Botones “Generar equipos” y “Volver a sortear”.

Si es sencillo, añadir “Mantener equipos” para conservarlos durante la sesión.

3. Inicio y final de sesión sin horario

Eliminar el horario como requisito para activar una clase. La profesora debe poder seleccionar cualquier grupo y pulsar “Comenzar sesión” en cualquier momento.

| Acción | Comportamiento esperado |
| --- | --- |
| Comenzar sesión | Se activa inmediatamente, sin comprobar franja horaria. Se registra fecha y hora real de inicio. |
| Finalizar sesión | Se cierra la sesión y se guarda la hora real de finalización. |
| Horario | No es necesario configurarlo ni mostrarlo. Ninguna función debe depender de él. |

| PRINCIPIO<br>La profesora controla cuándo empieza y termina la sesión; la aplicación no debe bloquear el acceso por horario. |
| --- |

4. Rediseño de RT

La vista actual resulta demasiado pequeña y dificulta localizar rápidamente a cada alumno. RT es una herramienta privada de gestión docente y debe priorizar velocidad y legibilidad.

4.1 Identificación y orden

Mostrar nombre y apellidos reales; no usar alias.

Ordenar alfabéticamente por apellidos/nombre.

Añadir buscador por nombre real.

Aumentar tamaño de texto, altura de fila y separación visual.

4.2 Selector RT

Sustituir los cuatro botones repetidos por un único desplegable por alumno.

| Alumno | RT |
| --- | --- |
| Alonso Pérez, Marta | 10 ▼ |
| Álvarez Ruiz, Pablo | 5 ▼ |
| Benítez Gómez, Lucía | A ▼ |
| Carmona Díaz, Hugo | 0 ▼ |

Valores disponibles: 10 / 5 / 0 / A.

4.3 A = Ausente

No entra en la media de RT.

No modifica la Energía.

No cuenta como tarea no realizada.

No rompe una racha de tareas completas.

4.4 Acción global

Mantener o añadir “Asignar 10 a todos” y modificar después únicamente las excepciones. Este flujo es esencial para trabajar con grupos de aproximadamente 30 alumnos.

5. Historial privado y limpieza de interfaz

| Cambio | Tipo | Comportamiento |
| --- | --- | --- |
| “Familia” → “Categoría” | UI / terminología | Mismo dato subyacente; solo cambia la etiqueta visible. |
| Eliminar “7 registros” de la parte superior | UI | Quitar el contador/texto innecesario. |
| Eliminar “Un toque para registrar” | UI | Quitar el texto de ayuda de la ficha/panel del alumno. |

6. Terminología de XP y especialidades

6.1 Categorías XP

La versión española actual ha reinterpretado las categorías. No deben usarse “Voz y expresión”, “Cuidado y precisión”, “Progreso constante” ni “Aprender juntos” como nombres de categoría.

| Clave interna | Nombre fijo en español | Descripción opcional |
| --- | --- | --- |
| communication | Comunicación | Participación y uso del francés |
| precision | Precisión | Cuidado y corrección |
| consistency | Constancia | Esfuerzo y perseverancia |
| collaboration | Colaboración | Ayuda y trabajo con otros |

| IMPORTANTE<br>Los nombres de categoría son términos funcionales del sistema. Deben ser idénticos en XP rápido, historial, rúbrica, filtros, estadísticas y cualquier otra pantalla. Las descripciones son secundarias y no deben sustituir al nombre. |
| --- |



![Referencia visual](assets/Protocole_Eclipse_Ajustes%201/image1.jpeg)


Figura 1. Captura actual en español: ejemplo del problema de traducción/reinterpretación de las categorías XP.

6.2 Especialidades en español

| Inglés | Español |
| --- | --- |
| Helper | Ayudante |
| Ally | Aliado/a |
| Leader | Líder |
| Diplomat | Diplomático/a |
| Strategist | Estratega |
| Analyst | Analista |
| Disciplined | Disciplinado/a |
| Perseverant | Perseverante |

7. Sustitución de monedas por gemas

Eliminar referencias activas al sistema anterior de monedas. No debe seguir apareciendo “Historial de monedas” ni otros textos equivalentes en pantallas actuales.

Terminología activa:

| Recurso | Uso visual |
| --- | --- |
| Esmeralda | Recurso común |
| Rubí | Recurso raro |
| Diamante | Recurso muy raro |

8. Dirección visual de las gemas

| ESTILO VALIDADO<br>B · Minimalista elegante. Limpio, moderno, juvenil, tipo videojuego, muy legible incluso en pequeño y sin ornamentación RPG excesiva. |
| --- |

8.1 Definición

| Gema | Dirección visual |
| --- | --- |
| Esmeralda | Verde intenso, facetada, forma limpia, brillo moderado. |
| Rubí | Rojo intenso, forma algo más angulosa y mayor presencia visual. |
| Diamante | Azul/blanco, muy luminoso, aspecto premium y claramente más raro. |

8.2 Contadores

Evitar textos largos como “Esmeraldas 1 · Rubíes 0 · Diamantes 0”. Usar los iconos gráficos reales con contador compacto, por ejemplo: [gema] 4 · [gema] 1 · [gema] 0. No usar emojis como solución final.

8.3 Coherencia

Ficha de alumno

Lista de alumnos

Boutique / skins

Recompensas

Historial de gemas

Mensajes de obtención y gasto



![Referencia visual](assets/Protocole_Eclipse_Ajustes%201/image2.png)


Figura 2. Referencia visual validada para Esmeralda, Rubí y Diamante: Estilo B · Minimalista elegante.

9. Sistema global de bloqueo / desbloqueo

| Estado | Icono / visual | Regla |
| --- | --- | --- |
| Bloqueado | Candado cerrado | Elemento desactivado, menor contraste y requisito visible cuando proceda. |
| Desbloqueado | Candado abierto o estado activo | Contenido accesible. Puede utilizarse candado abierto en elementos donde ayude a leer el progreso. |
| Completado / adquirido | Check | Indica que la escena, desafío u objeto ya se ha completado o comprado. |

Aplicar esta lógica al menos a:

Retransmisiones

Desafíos

Skins

Fondos y accesorios

Compras

Recompensas narrativas

Contenido condicionado por nivel, fecha o progreso

Futuros secretos o zonas bloqueadas

Ejemplos de requisito visible:

“Se desbloquea en Nivel 5”

“Disponible el 15 de noviembre”

“Completa la Retransmisión 3”

“Requiere 2 Esmeraldas”

10. Rúbricas en formato tipo Additio

Las rúbricas las proporciona la profesora. La web no debe inventar, traducir, reinterpretar ni modificar sus criterios o descriptores. El cambio solicitado es de formato de visualización y selección.

10.1 Formato

| Criterio | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
| --- | --- | --- | --- | --- |
| Comunicación | Descriptor | Descriptor | Descriptor | Descriptor |
| Precisión | Descriptor | Descriptor | Descriptor | Descriptor |
| Constancia | Descriptor | Descriptor | Descriptor | Descriptor |
| Colaboración | Descriptor | Descriptor | Descriptor | Descriptor |

10.2 Interacción

Una fila por criterio y niveles en columnas.

Una única celda seleccionable por fila.

La celda elegida queda claramente resaltada.

Puede cambiarse antes de cerrar la evaluación.

La puntuación final se calcula automáticamente.

Una propuesta automática basada en XP, si existe, es solo sugerencia. La selección final siempre corresponde a la profesora.

La rúbrica debe abrirse con ancho suficiente; evitar panel lateral estrecho.

11. Nueva interfaz horizontal del alumnado / Modo Aula

La interfaz validada parte del croquis de la profesora, corregido a orientación horizontal. Debe sentirse como una pantalla de aventura y no como un panel académico.



![Referencia visual](assets/Protocole_Eclipse_Ajustes%201/image3.jpg)


Figura 3. Croquis funcional original aportado por la profesora, rotado a horizontal: alumnos en rejilla, Retransmisiones arriba a la derecha y zona de Desafío.

11.1 Estructura

| Zona | Contenido y comportamiento |
| --- | --- |
| Izquierda · Desafío | Panel grande con imagen, título, instrucciones/pista y botón de acción. Puede permanecer bloqueado hasta abrir la Retransmisión correspondiente. |
| Centro · Alumnos | Rejilla visual de avatares circulares. Nombre o alias debajo. Clic en avatar/nombre abre la ficha del alumno. |
| Arriba derecha · Retransmisiones | Nueve números visibles. Completadas con check, disponible iluminada, bloqueadas con candado. La nueva parpadea. |
| Derecha / modal · Vídeo | Al pulsar una Retransmisión disponible se abre el vídeo, título/contexto y botón grande “VER DESAFÍO”. |

11.2 Flujo de una Retransmisión en Modo Aula

1. La nueva Retransmisión se ilumina y parpadea.

2. La profesora pulsa su número.

3. Se abre el vídeo en una ventana/modal atractiva.

4. Tras el vídeo aparece “VER DESAFÍO”.

5. El panel de Desafío muestra la actividad colectiva de 5–10 minutos.

12. Dirección artística del Modo Aula

| DIRECCIÓN VISUAL VALIDADA<br>Interfaz horizontal, muy visual y colorida, ambientada en una isla costera francesa. Debe mezclar aventura, misterio, colegio y exploración. Los alumnos aparecen como adolescentes con uniforme y avatares 3D animados juveniles. |
| --- |

12.1 Elementos visuales

Mar azul y costa rocosa

Vegetación y sensación de isla

Madera, mapas, brújulas y señales

Radios / retransmisiones / tecnología ligera

Papeles, documentos y material de exploración

Contraste entre superficies cálidas de aventura y paneles tecnológicos oscuros para vídeo/retransmisiones

12.2 Alumnos

Adolescentes de aproximadamente 11–14 años.

Estilo 3D animado juvenil cinematográfico (referencia tipo “Pixar adolescente”).

Uniforme escolar visible.

Rostros, peinados y tonos variados, manteniendo coherencia artística.

No infantilizar en exceso; no usar estética militar ni hiperrealista.

12.3 Qué evitar

Dashboard corporativo o administrativo.

Minimalismo blanco excesivamente frío.

Pantalla escolar plana y sin narrativa.

Exceso de elementos RPG medievales o fantasía ajena al contexto de la isla/colegio.



![Referencia visual](assets/Protocole_Eclipse_Ajustes%201/image4.png)


Figura 4. Referencia visual validada para el Modo Aula: isla, adolescentes uniformados, rejilla central, Retransmisiones, vídeo y panel de Desafío. Usar como dirección artística, no como reproducción literal.

13. Prioridades de implementación

| Prioridad | Cambios |
| --- | --- |
| Alta | Retransmisiones; eliminación de horario; rediseño de RT; categorías XP correctas; nombres reales en RT; rúbricas tipo Additio; nueva interfaz horizontal de alumnos; sistema de candados. |
| Media-alta | Rediseño de gemas; traducción completa de especialidades; Organización; eliminación de referencias a monedas. |
| Baja / limpieza | Eliminar “7 registros”; eliminar “Un toque para registrar”; cambiar “Familia” por “Categoría”. |

14. Criterios de aceptación

☐ La profesora puede iniciar cualquier grupo en cualquier momento sin horario configurado.

☐ RT muestra nombres reales en orden alfabético, buscador y selector 10 / 5 / 0 / A.

☐ A no entra en la media, no modifica Energía y no rompe rachas.

☐ Las categorías XP aparecen exactamente como Comunicación, Precisión, Constancia y Colaboración.

☐ No aparece “Historial de monedas” ni referencias activas al sistema anterior de monedas.

☐ Las gemas usan una iconografía coherente con el Estilo B validado.

☐ Las nueve Retransmisiones muestran claramente su estado de bloqueo/disponibilidad/completado.

☐ La nueva Retransmisión destaca y parpadea hasta ser abierta.

☐ Cada Retransmisión abre vídeo y después el botón “VER DESAFÍO”.

☐ Las rúbricas se muestran como matriz ancha y permiten una selección por criterio.

☐ El Modo Aula es horizontal, colorido, narrativo e inmersivo, con avatares adolescentes uniformados.

☐ La zona privada docente mantiene una estética más sobria y funcional para agilizar el trabajo.

| CRITERIO DE DISEÑO FINAL<br>La parte privada debe hacer pensar a la profesora: “Puedo gestionar 30 alumnos rápidamente”. El Modo Aula debe hacer pensar al alumnado: “Estamos dentro de Protocole Éclipse”. |
| --- |
