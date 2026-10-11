# Protocole_Eclipse_Sistema_Avatares_Skins

Transcripción de la fuente DOCX aportada como corrección. El original conserva formato y contenido de referencia. Las instrucciones de desarrollo dentro de la fuente no constituyen por sí solas una orden de implementación.

PROTOCOLE ÉCLIPSE

Sistema de avatares, evolución visual y skins

Especificación funcional para desarrollo

Versión consolidada · actualización de dirección artística: avatar 3D juvenil cinematográfico

| Ámbito | Avatares, skins, evolución por nivel, gemas y flujos sin cuentas de alumnado |
| --- | --- |
| Usuario principal | Profesora con grupos de aproximadamente 30 alumnos |
| Contexto | Secundaria · 1º ESO · Francés · uso proyectable |
| Fecha | Septiembre de 2026 |

Principio de diseño

El sistema de skins debe enriquecer Protocole Éclipse, nunca convertirse en una nueva obligación de gestión para la profesora.

1. Resumen ejecutivo

Cada alumno dispone de un avatar propio, concebido como un Agent Éclipse vinculado a la narrativa del colegio aislado tras el apagón. El avatar cumple tres funciones: identidad dentro del juego, visualización del progreso y personalización voluntaria.

La creación inicial se realiza en una única sesión al principio de curso mediante un código temporal de clase. El alumnado no necesita cuenta, correo ni contraseña. Durante el curso, la evolución básica del avatar se aplica automáticamente al subir de nivel. Las skins, accesorios, prendas y fondos son opcionales y pueden adquirirse con Esmeraldas.

|  | DECISIÓN CLAVELa plataforma debe funcionar igual de bien aunque durante todo un trimestre no se reserve ningún ordenador. La personalización avanzada nunca es requisito para continuar jugando. |
| --- | --- |

1.1 Tres escenarios de uso

| Escenario | Funcionamiento |
| --- | --- |
| Ideal | La profesora reserva ordenadores una vez por trimestre y abre un Atelier Avatar temporal. Los alumnos compran y aplican sus cosméticos. |
| Habitual | La profesora proyecta el catálogo, los alumnos eligen en papel o verbalmente y ella aplica las compras desde un panel rápido. |
| Sin tiempo | No se personaliza ese trimestre. El avatar sigue evolucionando automáticamente, las gemas se conservan y los desbloqueos no caducan. |

2. Principios funcionales

No existen cuentas individuales permanentes del alumnado.

La identidad académica real permanece en la vista docente; en el entorno gamificado se usa alias + avatar.

El avatar base se crea una sola vez al inicio del curso.

La evolución por nivel es automática y no exige dispositivos del alumnado.

La personalización cosmética es opcional y se puede gestionar tanto por el alumno como por la profesora.

Los desbloqueos adquiridos o habilitados no se pierden por no usarlos inmediatamente.

Las skins no deben caducar por defecto.

Las Esmeraldas pueden gastarse en ventajas académicas o en personalización; el alumno decide.

Las compras y movimientos de gemas deben ser auditables y reversibles.

La experiencia debe requerir muy pocos clics en uso docente.

|  | BASE FUNCIONAL ORIGINALLa especificación original ya establece que la aplicación no requiere cuentas individuales del alumnado y que avatar, alias, especialidad y personaje forman parte del perfil. Este documento amplía ese comportamiento sin alterar el principio de acceso docente. |
| --- | --- |

3. Concepto visual de los avatares

Los avatares representan Agents Éclipse: adolescentes integrados en una aventura contemporánea de misterio, tecnología, exploración y aislamiento. La dirección artística definitiva será de animación 3D juvenil cinematográfica, con referencia visual tipo «Pixar adolescente»: personajes muy expresivos, atractivos y fáciles de reconocer, pero sin aspecto infantil ni hiperrealista.

3.1 Dirección artística definitiva

Estilo 3D animado juvenil cinematográfico, con referencia visual tipo «Pixar adolescente».

Personajes con apariencia aproximada de 11–14 años: juveniles y expresivos, pero nunca con proporciones de bebé o de dibujo infantil.

Rostros amables y expresivos, ojos vivos y ligeramente grandes, proporciones estilizadas moderadas y rasgos claramente diferenciables.

Elementos de expedición y tecnología: radios, auriculares, brújulas, linternas, mochilas, dossiers, tabletas, brazaletes y visores.

Encuadre preferente de busto o medio cuerpo. La identidad visual se apoya en peinado, rostro, ropa, accesorios, insignias y fondo, no en detalles diminutos.

La cara, peinado y rasgos base elegidos en septiembre permanecen reconocibles durante todo el curso; la evolución visual se produce principalmente mediante ropa, accesorios, insignias, marcos y fondos.

Todos los componentes deben mantener una dirección de cámara, escala, iluminación y acabado coherentes para que las skins y accesorios parezcan pertenecer al mismo personaje y al mismo universo.

Los fondos pueden representar Archives, Laboratoire, Communications, Quai, Bâtiment principal, exterior de la isla y, cuando se desbloquee narrativamente, Secteur Restreint.

La paleta debe seguir el universo Protocole Éclipse: azul oscuro, grafito, verde señal, ámbar y pequeños detalles luminosos, sin limitar la diversidad de ropa, piel o cabello.

Ropa moderna y juvenil integrada en la ficción: sudaderas, chaquetas técnicas, mochilas, brazaletes, radios, auriculares, linternas, dossiers y otros elementos de exploración no militar.

3.2 Evitar

Estética excesivamente infantil: evitar cabezas desproporcionadamente grandes, cuerpos de bebé, gestos de guardería o apariencia de alumnado de Primaria.

Clases medievales, magos, guerreros o fantasía que rompa la ambientación contemporánea.

Diseño militar o agresivo.

Retratos hiperrealistas o fotográficos; el objetivo es que el avatar sea una interpretación 3D estilizada, no un retrato biométrico del alumno.

Detalles demasiado finos que se pierdan en la vista proyectada.

Terminología para producción: aunque la referencia creativa solicitada es «estilo Pixar adolescente», en prompts, briefs técnicos y documentación de assets se recomienda usar «animación 3D juvenil cinematográfica / 3D animated teen adventure style» para describir la dirección visual sin exigir una copia literal de una franquicia concreta.

4. Creación inicial del avatar

4.1 Objetivo

A principio de curso se dedica una sesión completa a la creación del avatar base. Esta es la única sesión que se considera necesaria. El alumno debe salir de ella con un agente reconocible que seguirá siendo suyo durante todo el curso.

4.2 Flujo docente

1.  La profesora abre el grupo y selecciona Avatares > Abrir sesión de creación.

2.  La aplicación genera un código temporal asociado únicamente a ese grupo.

3.  La profesora proyecta el código y, si procede, una URL o QR para los ordenadores del aula.

4.  Los alumnos acceden al creador sin autenticación permanente.

5.  La profesora ve en tiempo real qué agentes han guardado su avatar.

6.  Cuando termina la sesión, la profesora cierra el acceso. El código deja de ser válido.

4.3 Flujo alumno

1.  Introduce el código temporal de clase.

2.  Selecciona su alias/agente o el identificador que la profesora haya preparado.

3.  Personaliza el avatar base.

4.  Previsualiza el resultado.

5.  Confirma y guarda.

4.4 Campos configurables inicialmente

| Elemento | Comportamiento |
| --- | --- |
| Rostro | Elección del alumno; se mantiene como identidad básica todo el curso. |
| Tono de piel | Elección inicial; no cambia automáticamente. |
| Peinado | Elección inicial; puede mantenerse estable como rasgo identificativo. |
| Color de pelo | Elección inicial. |
| Prenda base | Elección entre un conjunto reducido de prendas iniciales. |
| Alias / callsign | Identidad gamificada proyectable, gestionada por la profesora. |
| Especialidad | Se refleja visualmente, pero su asignación depende del sistema general de Protocole Éclipse. |

5. Identidad persistente y evolución

La cara del agente no debe transformarse por subir de nivel. El objetivo es que el alumno reconozca siempre a su personaje. Lo que evoluciona son los elementos que rodean a esa identidad.

| Permanece estable | Puede evolucionar |
| --- | --- |
| Rostro | Prendas |
| Tono de piel | Accesorios |
| Peinado base | Insignias |
| Rasgos principales | Marcos |
| Alias | Fondos |
| Identidad visual | Elementos de especialidad |

6. Evolución automática por nivel

La aplicación ya calcula el nivel a partir del XP. Cada subida de nivel debe activar automáticamente una evolución visual o un desbloqueo, sin intervención docente. La recompensa visual convierte el nivel en algo tangible para el alumno.

| Nivel | Evolución automática propuesta | Personalización que se habilita |
| --- | --- | --- |
| 1 | Avatar base | - |
| 2 | Brazalete Éclipse | - |
| 3 | Nuevo rango visual | Accesorios básicos |
| 4 | Insignia de especialidad | Prendas de especialidad |
| 5 | Marco mejorado | Fondos/localizaciones |
| 6 | Detalle visual avanzado | Accesorios avanzados |
| 7 | Marco o insignia élite | Skins especiales |
| 8 | Apariencia final Agent Éclipse | Skin final exclusiva |

|  | IMPORTANTELos elementos exactos de cada nivel son contenido configurable. Lo importante para desarrollo es que exista un sistema de desbloqueos automáticos por nivel y categorías de cosméticos bloqueadas por requisito. |
| --- | --- |

6.1 Feedback de Level Up

Cuando un alumno cruza un umbral, la aplicación puede mostrar durante 2-5 segundos una animación breve en modo aula:

|  | EJEMPLONIVEAU SUPÉRIEUR · LYNX · NIVEAU 3 · OPÉRATEUR · NOUVEAU DÉBLOCAGE |
| --- | --- |

La animación no debe bloquear el registro docente ni interrumpir la clase durante demasiado tiempo.

7. Relación visual con las especialidades

La especialidad no crea cuatro avatares completamente distintos. Funciona como una capa visual temática sobre el mismo Agent Éclipse.

| Especialidad | Motivos visuales sugeridos |
| --- | --- |
| Communication | Radio, auriculares, micrófono, ondas de señal, comunicador. |
| Précision | Visor, dossier, mapa, lupa, tablet o instrumental de análisis. |
| Constance | Mochila, linterna, herramientas, equipamiento resistente. |
| Collaboration | Kit de apoyo, cuerda, botiquín, herramientas compartidas. |

8. Boutique Avatar

Además de la evolución automática, existen cosméticos voluntarios que pueden adquirirse mediante Esmeraldas. La boutique debe ser pequeña para no sobrecargar ni al alumno ni a la profesora.

8.1 Tamaño recomendado

Cada trimestre puede incorporar aproximadamente 6-10 cosméticos nuevos. Los cosméticos anteriores permanecen disponibles por defecto.

| Código | Ejemplo | Tipo | Coste orientativo |
| --- | --- | --- | --- |
| A1 | Casque | Accesorio | 1 Esmeralda |
| A2 | Radio | Accesorio | 1 Esmeralda |
| A3 | Boussole | Accesorio | 1 Esmeralda |
| V1 | Veste technique | Prenda | 2 Esmeraldas |
| V2 | Sac Éclipse | Prenda/accesorio | 2 Esmeraldas |
| F1 | Archives | Fondo | 1 Esmeralda |
| F2 | Communications | Fondo | 1 Esmeralda |
| S1 | Skin Blackout | Skin completa | 3 Esmeraldas |

8.2 Regla de desbloqueo

El nivel puede desbloquear categorías o elementos, pero no obliga a comprarlos. Un cosmético puede combinar requisito de nivel + coste en Esmeraldas.

|  | EJEMPLONivel 5 desbloquea la categoría Fondos. A partir de ese momento el alumno puede comprar Archives por 1 Esmeralda o Communications por 1 Esmeralda. |
| --- | --- |

9. Relación con las Esmeraldas

Las Esmeraldas tienen un doble uso deliberado: académico y cosmético. Esto genera una decisión sencilla de gestión de recursos sin añadir una moneda específica para skins.

| Uso | Ejemplo |
| --- | --- |
| Académico | 2 Esmeraldas pueden canjearse por una ventaja común válida en una prueba. |
| Cosmético | 1-3 Esmeraldas pueden emplearse para comprar accesorios, fondos o skins. |

|  | PRINCIPIO DE BALANCELas skins deben ser suficientemente asequibles para que gastar en personalización sea una opción real. Si todos los cosméticos son caros, el alumno reservará siempre las Esmeraldas para las pruebas y la boutique perderá sentido. |
| --- | --- |

10. Personalización durante el curso: dos vías

10.1 Opción A - gestión por la profesora

Debe ser el flujo por defecto porque los alumnos de 1º ESO no disponen normalmente de móvil y reservar el carrito de ordenadores puede ser difícil.

1.  La profesora proyecta o imprime el catálogo trimestral.

2.  Cada alumno elige un código de artículo en papel o verbalmente.

3.  La profesora abre el panel rápido de personalización del alumno.

4.  Selecciona el código correspondiente.

5.  La aplicación comprueba requisitos y saldo.

6.  Descuenta las Esmeraldas, registra la operación y aplica el cosmético.

Interfaz docente mínima

|  | PANEL RÁPIDOLYNX · Niveau 4 · Esmeraldas x4 · [A1] Casque · [A2] Radio · [V1] Veste · [F1] Archives · [APLICAR] |
| --- | --- |

La compra debería resolverse en 1-2 acciones cuando la elección ya está tomada.

10.2 Opción B - Atelier Avatar trimestral

Si la profesora dispone de tiempo y puede reservar ordenadores, puede abrir como máximo un Atelier Avatar por trimestre. Es un evento opcional, no una dependencia funcional.

1.  La profesora abre Avatares > Abrir Atelier.

2.  La aplicación genera un código temporal para el grupo.

3.  El alumno entra sin cuenta permanente.

4.  Solo puede acceder a personalización, saldo, catálogo y cosméticos desbloqueados.

5.  Compra, equipa o cambia sus cosméticos.

6.  La profesora cierra la sesión y el código expira.

Restricciones del Atelier

No permite acceder a notas, rúbricas, disciplina o datos privados.

No permite modificar nombre real.

No permite modificar libremente la identidad base salvo que la profesora lo habilite.

No permite comprar artículos sin saldo o sin requisitos.

No requiere correo, contraseña ni cuenta.

11. Fallback cuando no hay ordenadores o no hay tiempo

|  | REGLA DE PRODUCTONo realizar un Atelier Avatar durante un trimestre no puede causar ningún perjuicio funcional al alumno. |
| --- | --- |

El avatar continúa evolucionando automáticamente por nivel.

Las Esmeraldas se conservan.

Los cosméticos desbloqueados siguen disponibles.

Las skins anteriores no caducan por defecto.

La profesora puede aplicar compras en cualquier momento posterior.

El alumno no pierde oportunidades por no haber tenido acceso a un dispositivo.

12. Gestión de compras y personalizaciones pendientes

Para reducir carga administrativa, la plataforma debe permitir posponer la aplicación de skins y agrupar las decisiones en una cola.

|  | EJEMPLO DE COLAPERSONNALISATIONS EN ATTENTE · LYNX A2 · NOVA F1 · ORION V2 · RAVEN A1 · [VALIDER TOUT] |
| --- | --- |

12.1 Funciones recomendadas

Añadir una elección pendiente sin cobrar todavía.

Validar una compra individual.

Validar varias compras en lote.

Mostrar error si el saldo cambió y ya no es suficiente.

Permitir cambiar la elección antes de validar.

Mantener una marca de compras o desbloqueos pendientes en la ficha docente.

13. Integración con la ficha de personaje

El avatar se integra en la ficha gamificada del alumno junto con nivel, XP, Energía, vidas y gemas. La vista proyectable debe mantener la privacidad académica definida por el diseño original.

|  | FICHA CONCEPTUALLYNX · ANALYSTE · NIVEAU 3 / OPÉRATEUR · XP 31/45 · ÉNERGIE: HAUTE · VIES: 4 · GEMMES: Esmeraldas x3 / Rubíes x0 / Diamantes x0 · [AVATAR] |
| --- | --- |

13.1 Energía

La Energía se muestra como semáforo cualitativo, nunca como nota numérica en la vista del alumno.

| Estado | Color visual |
| --- | --- |
| Crítica | Rojo |
| Baja | Naranja |
| Estable | Amarillo |
| Alta | Verde |
| Máxima | Verde intenso |

13.2 Vidas

La ficha privada/individual incorpora 4 vidas relacionadas con disciplina. Cada incidencia de Código Rojo consume una vida. Al perder la cuarta, la aplicación alcanza el equivalente funcional de cuatro incidencias y propone el parte correspondiente para decisión manual de la docente.

|  | PRIVACIDADLas vidas no deben mostrarse en la vista general proyectada de toda la clase si permiten deducir información disciplinaria. Sí pueden mostrarse en la ficha privada de la docente y, si se decide, en la vista individual “Mostrar al alumno”. |
| --- | --- |

14. Cosméticos vinculados a la narrativa

Las zonas y acontecimientos de Protocole Éclipse pueden convertirse en fondos o skins, lo que hace que la personalización refuerce la historia sin añadir mecánicas nuevas.

| Zona / capítulo | Ejemplo de cosmético |
| --- | --- |
| Bibliothèque / Archives | Fondo de estanterías, dossier clasificado, luz de emergencia. |
| Laboratoire | Bata técnica, visor, fondo de instrumentos. |
| Communications | Auriculares, radio, ondas de señal, consola. |
| Quai | Impermeable, brújula, fondo del muelle. |
| Secteur Restreint | Skin o fondo especial desbloqueable cuando la zona aparezca en la narrativa. |
| Blackout | Skin temática del apagón o iluminación de emergencia. |

Los cosméticos narrativos pueden desbloquearse por capítulo, nivel o evento y seguir disponibles después. Las ediciones limitadas deben ser una excepción, no la norma.

15. Modelo de datos propuesto

Los nombres exactos pueden adaptarse a la arquitectura existente. La intención funcional es separar identidad base, apariencia equipada, propiedad de cosméticos y catálogo.

15.1 Avatar base

| Campo | Descripción |
| --- | --- |
| avatarBase / preset | Referencia al conjunto visual base. |
| face | Rostro seleccionado. |
| skinTone | Tono de piel. |
| hair | Peinado. |
| hairColor | Color de pelo. |
| baseClothing | Prenda inicial. |
| alias | Identidad gamificada proyectable. |

15.2 Apariencia equipada

| Campo | Descripción |
| --- | --- |
| equippedAccessory | Accesorio activo. |
| equippedClothing | Prenda activa. |
| equippedBackground | Fondo activo. |
| equippedFrame | Marco activo. |
| equippedSkin | Skin completa activa. |

15.3 Catálogo de cosméticos

| Campo | Descripción |
| --- | --- |
| id / code | Identificador y código corto visible. |
| name | Nombre del cosmético. |
| type | Accessory / Clothing / Background / Frame / Skin. |
| asset | Referencia visual o capas necesarias. |
| emeraldCost | Coste en Esmeraldas. |
| minimumLevel | Nivel mínimo requerido, si existe. |
| specialtyRequirement | Especialidad requerida, opcional. |
| chapterRequirement | Capítulo/evento requerido, opcional. |
| active | Disponibilidad en catálogo. |

15.4 Propiedad de cosméticos

| Campo | Descripción |
| --- | --- |
| studentId | Alumno propietario. |
| cosmeticId | Cosmético adquirido. |
| acquiredAt | Fecha/hora. |
| acquisitionType | PURCHASE / LEVEL / EVENT / MANUAL. |
| cost | Coste aplicado en el momento de adquisición. |

16. Movimientos de gemas y trazabilidad

Toda compra debe generar un movimiento auditable. No debe modificarse el saldo sin registrar el origen del cambio.

| Campo | Ejemplo |
| --- | --- |
| studentId | ID del alumno |
| gemType | EMERALD |
| amount | -2 |
| reason | AVATAR_PURCHASE |
| referenceId | V2 |
| date | Fecha/hora |
| reversed | false / true |

16.1 Deshacer

La profesora debe poder revertir una compra accidental. Al deshacer, el cosmético se retira si procede, las Esmeraldas se restituyen y la operación queda trazada como reversión.

17. Reglas automáticas principales

| Evento | Comportamiento esperado |
| --- | --- |
| Subida de nivel | Aplicar automáticamente el desbloqueo/evolución correspondiente y registrar la novedad. |
| Intento de compra | Comprobar saldo, nivel, especialidad y capítulo antes de aceptar. |
| Compra válida | Descontar Esmeraldas, registrar movimiento, añadir propiedad y permitir equipar. |
| Compra inválida | No cambiar saldo; mostrar causa clara. |
| Atelier cerrado | Denegar edición desde acceso temporal. |
| Código expirado | No permitir acceso. |
| Cosmético ya adquirido | No cobrar de nuevo si el modelo es de propiedad permanente. |
| Desbloqueo no usado | Mantenerlo disponible indefinidamente salvo configuración explícita. |
| Cambio de cosmético equipado | No cobrar si el alumno ya es propietario del elemento. |
| Undo | Revertir saldo y estado de propiedad/aplicación según el caso. |

18. UX docente

La gestión de avatar debe ajustarse al principio global de Protocole Éclipse: cualquier operación frecuente debe ser extremadamente rápida.

18.1 Vista de alumno

Avatar actual y alias.

Nivel y nuevos desbloqueos.

Saldo de Esmeraldas.

Botón Personalizar.

Cosméticos en propiedad.

Personalizaciones pendientes.

Acceso a historial de compras.

Botón Deshacer cuando proceda.

18.2 Vista de grupo

Número de avatares creados / pendientes.

Alumnos con nuevos desbloqueos.

Personalizaciones pendientes.

Atajo para abrir/cerrar sesión de creación o Atelier.

Catálogo proyectable.

Validación en lote cuando exista cola de elecciones.

19. Acceso temporal y privacidad

El acceso de alumnado debe ser una sesión limitada a avatar, no una cuenta parcial del sistema.

Código asociado a un único grupo.

Código con expiración y cierre manual.

Sin acceso a nombre real de otros alumnos.

Sin acceso a notas, rúbricas, RT exacto, disciplina, historial o comentarios.

Sin posibilidad de modificar saldo directamente.

Sin posibilidad de modificar XP, nivel o Energía.

Toda compra se valida en servidor contra requisitos y saldo reales.

La profesora puede revocar la sesión en cualquier momento.

20. Prioridad de implementación

| Prioridad | Módulo |
| --- | --- |
| P0 | Avatar base y modelo de apariencia. |
| P0 | Sesión temporal de creación inicial. |
| P0 | Asociación segura del avatar con alumno/grupo. |
| P0 | Visualización en fichas y modo aula. |
| P0 | Evolución/desbloqueos automáticos por nivel. |
| P1 | Catálogo de cosméticos. |
| P1 | Compra con Esmeraldas. |
| P1 | Requisitos por nivel y equipar/desequipar. |
| P1 | Panel docente de personalización rápida. |
| P2 | Atelier Avatar temporal para alumnado. |
| P2 | Cola de compras/personalizaciones pendientes. |
| P2 | Validación en lote. |
| P3 | Skins ligadas a capítulos, rareza y ediciones especiales. |
| P3 | Animaciones y efectos avanzados. |

21. Criterios de aceptación

La profesora puede abrir una sesión temporal de creación para un grupo y cerrarla cuando quiera.

Un alumno puede crear su avatar sin correo, contraseña ni cuenta permanente.

El avatar queda asociado al alumno correcto y se visualiza en su ficha.

La identidad base se conserva al subir de nivel.

Una subida de nivel aplica automáticamente el desbloqueo previsto sin intervención docente.

El alumno puede tener cosméticos desbloqueados aunque todavía no los haya comprado o equipado.

La profesora puede comprar/aplicar un cosmético desde la ficha del alumno en muy pocas acciones.

Una compra descuenta automáticamente las Esmeraldas correctas y queda registrada.

No se puede comprar sin saldo o sin cumplir requisitos.

Un cosmético comprado permanece en propiedad y puede equiparse de nuevo sin volver a pagarlo.

La profesora puede deshacer una compra accidental.

Los desbloqueos no desaparecen por no realizar un Atelier Avatar.

Las skins antiguas permanecen disponibles salvo que se marquen expresamente como limitadas.

El Atelier temporal, si se habilita, solo expone información de personalización.

La vista general de clase no revela vidas/disciplinas individuales.

22. Decisiones cerradas y cuestiones a definir

22.1 Decisiones cerradas

Sesión inicial con ordenadores para crear avatar base.

Sin cuentas permanentes de alumnado.

Evolución automática por nivel.

Skins y accesorios voluntarios adquiribles con Esmeraldas.

Esmeraldas con doble uso: académico y cosmético.

Posibilidad de personalización docente o Atelier trimestral.

No obligación de reservar ordenadores durante el curso.

No caducidad ordinaria de desbloqueos y skins.

Identidad facial básica estable durante el curso.

Sistema compatible con 4 vidas de disciplina y Energía tipo semáforo.

Dirección visual cerrada: avatares 3D de animación juvenil cinematográfica, referencia tipo «Pixar adolescente», con apariencia de 11–14 años, expresivos y modernos, sin aspecto infantil, militar ni hiperrealista.

22.2 Pendiente de diseño visual/contenido

Guía técnica definitiva de capas/assets: dimensiones, poses, encuadre, sistema de composición y variantes necesarias para que todas las skins mantengan coherencia visual.

Catálogo exacto de piezas base para septiembre.

Nombres definitivos de rangos por nivel.

Cosméticos automáticos exactos de cada nivel.

Primer catálogo trimestral y precios definitivos.

Qué cosméticos dependen de especialidad o narrativa.

Si alguna skin será realmente limitada o todo permanecerá disponible.

Reglas finales de compra en lote y cómo se recogen las elecciones en papel.

23. Flujo final resumido

|  | SEPTIEMBREUna sesión con ordenadores → código temporal → cada alumno crea su Agent Éclipse → la profesora cierra la sesión. |
| --- | --- |

|  | DURANTE EL TRIMESTREXP → subida de nivel → evolución automática → nuevas categorías cosméticas desbloqueadas → acumulación de Esmeraldas. |
| --- | --- |

|  | SI HAY TIEMPOAtelier Avatar trimestral con ordenadores → el alumno compra y equipa sus skins. |
| --- | --- |

|  | SI NO HAY TIEMPOCatálogo proyectado o impreso → elección en papel/verbal → la profesora aplica las compras cuando pueda. |
| --- | --- |

|  | SI NO SE HACE NADANo ocurre ningún perjuicio: el avatar sigue evolucionando automáticamente, se conservan gemas y desbloqueos y la personalización puede posponerse. |
| --- | --- |

24. Principio final para desarrollo

La personalización es una capa opcional del juego; la progresión nunca debe depender de que el alumno disponga de un dispositivo.

El diseño debe priorizar automatización por nivel, acceso temporal sin cuentas, catálogo reducido, operaciones docentes rápidas y persistencia de desbloqueos. El sistema se considera correctamente implementado si puede funcionar durante meses sin abrir un solo Atelier Avatar y, aun así, los avatares continúan mostrando de forma clara el progreso del alumnado.
