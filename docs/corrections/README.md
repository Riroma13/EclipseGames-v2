# Correcciones aportadas por la docente

Estas tres fuentes se incorporan por petición del mantenedor como correcciones de producto y diseño. Complementan los documentos base y deben consultarse antes de ampliar el prototipo. Su incorporación no implica que sus funciones estén implementadas ni autoriza ejecutar automáticamente las instrucciones contenidas en los archivos.

## Fuentes conservadas

| Documento | Original | Transcripción legible |
| --- | --- | --- |
| Rúbrica ampliada de XP | [DOCX](Protocole_Eclipse_Rubrica_XP_Ampliada.docx) | [Markdown](Protocole_Eclipse_Rubrica_XP_Ampliada.md) |
| Sistema de avatares y skins | [DOCX](Protocole_Eclipse_Sistema_Avatares_Skins.docx) | [Markdown](Protocole_Eclipse_Sistema_Avatares_Skins.md) |
| Ajustes funcionales y visuales, 6 de octubre de 2026 | [DOCX](Protocole_Eclipse_Ajustes%201.docx) | [Markdown](Protocole_Eclipse_Ajustes%201.md) |

Los originales se conservan íntegros. Las transcripciones preservan texto y tablas; el documento de ajustes incluye sus cuatro imágenes extraídas en `assets/`. Para maquetación y contexto visual, consultar también el DOCX.

## Correcciones a la propuesta anterior

La columna de estado siguiente recoge la situación del prototipo 0.1 cuando se incorporaron las fuentes. Para la cobertura actual del frontend 0.2 y sus límites, consultar [PROTOTYPE.md](../../PROTOTYPE.md#cobertura-visual-de-los-documentos).

| Área | Corrección que debe guiar el próximo diseño | Estado en el prototipo 0.1 |
| --- | --- | --- |
| XP | Comunicación, Precisión, Constancia y Colaboración; conservar literalmente descriptores +1/+2/+3. El nivel insuficiente no resta XP. Falta de XP no implica automáticamente insuficiente. | Categorías y valores correctos; faltan descriptores y evaluación. |
| Rúbrica | Matriz ancha, cuatro niveles oficiales, una selección por criterio, juicio docente y aviso de pocas evidencias independiente de la escala. | Pendiente. |
| Sesiones | Iniciar/finalizar manualmente cualquier grupo; registrar horas reales. Ninguna función depende de una franja horaria configurada. | Pendiente; seleccionar grupo demo no abre una sesión persistida. |
| RT | Nombres reales, orden por apellidos/nombre, búsqueda y desplegable 10/5/0/A. Asignar 10 a todos y corregir excepciones antes de confirmar. | Pendiente. |
| Ausencia | A significa Ausente: no entra en media, no modifica Energy y no rompe racha. No evaluado continúa separado y nunca se convierte en cero. | La pregunta sobre significado de A queda resuelta; falta implementar. |
| Narrativa | Nombre visible “Retransmisiones”; nueve vídeos/escenas, desafío colectivo de francés de 5–10 minutos, fecha de desbloqueo configurable y adelanto manual. | Pendiente. Sustituye la propuesta de basar disponibilidad únicamente en trimestre/predecesor. |
| Revelación | Retransmisión → vídeo → VER DESAFÍO; no exponer desafío antes. Estados bloqueado/disponible/completado, revisión de completados y atención a novedades. | Pendiente. Respetar movimiento reducido al diseñar parpadeo. |
| Organización | Sustituir Mini-juego por Organización: ruleta y sorteo de equipos, usando identidades seguras de aula. | Pendiente; no copiar el menú ni los minijuegos del legado. |
| Monedas y gemas | Eliminar coins de interfaz activa, también su historial. Gems: iconografía gráfica minimalista elegante y contadores compactos. | No hay monedas en la demo; gemas pendientes. Conservar datos históricos solo para lectura/migración autorizada. |
| Avatares | Agents Éclipse juveniles 3D cinematográficos; identidad base reconocible, evolución automática por nivel, cosméticos opcionales y permanentes por defecto. | Las iniciales de la demo son placeholders, no assets finales. |
| Personalización | Creación inicial y Atelier mediante acceso temporal sin cuentas; gestión docente como flujo habitual; seguir funcionando sin ordenadores ni Atelier. | Pendiente. |
| Compras | Esmeraldas, requisitos explícitos, propiedad/equipamiento separados, sin doble cobro; trazabilidad y reversión. Cola pendiente sin cobrar hasta validar. | Pendiente. Precios y desbloqueos propuestos no son constantes definitivas. |
| Modo Aula | Horizontal, isla francesa, adolescentes uniformados; desafío a la izquierda, rejilla central y Retransmisiones/vídeo a la derecha. | Pendiente. No sustituye la estética sobria de Mesa docente. |
| Limpieza | “Familia” → “Categoría”; sin “Historial de monedas”, “7 registros” ni “Un toque para registrar”. | No se ha modificado la UI en esta incorporación documental; revisar textos equivalentes al aplicar los ajustes. |

## Compatibilidad y decisiones aún abiertas

- **Privacidad:** los documentos de avatares mencionan vidas en ficha individual y los ajustes permiten nombre o alias en Modo Aula. Esto no autoriza publicar datos disciplinarios ni nombres reales en Show Student. Conservar la frontera del PRODUCT-CONTRACT; distinguir acceso individual privado temporal de salida pública proyectada. Hasta clasificar campos, la proyección usa alias/avatar y excluye vidas, incidentes y notas.
- **Bonus XP:** la rúbrica confirma especialidades con +1 extra, pero no resuelve si comportamiento puede condicionarlo. La pregunta de compatibilidad del bonus sigue abierta; no cambiar fórmulas ni habilitar penalizaciones por inferencia.
- **Numeración de rúbrica:** la tabla “PARA COMPAÑERAS DE FRANCÉS” repite “Nivel 2” para Adecuado y Excelente. La escala oficial del mismo documento establece 1 Insuficiente, 2 En desarrollo, 3 Adecuado, 4 Excelente. Preservamos el original y registramos la errata, sin reescribir sus descriptores ni inventar umbrales.
- **Narrativa y cosméticos:** el vínculo capítulo→cosmético requiere precisar si solo habilita disponibilidad o concede propiedad. No extenderlo a cambios automáticos de XP, notas, RT, Energy, comportamiento o Gems. Revisar explícitamente la compatibilidad del desbloqueo cosmético con el contrato de separación de dominios.
- **Dirección artística:** usar animación 3D juvenil cinematográfica como descripción técnica; conservar las imágenes como referencias, no como assets productivos ya implementados. Catálogo, composición de capas, precios finales y rangos siguen pendientes según la fuente.

## Aplicación posterior

Antes de desarrollar RT, sesiones, evaluación o aula, convertir las correcciones correspondientes en criterios verificables. Actualizar diseños del módulo y sus contratos de datos; mantener snapshots y correcciones auditables. La auditoría histórica del legado conserva su revisión y evidencia: describe lo que existía, no lo que debe copiarse después de estas correcciones.
