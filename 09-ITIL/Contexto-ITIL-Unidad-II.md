# Contexto ITIL v4 — Unidad II: Gestión de los servicios

> Material de referencia para el agente al generar documentación de proyectos (RodApp u otros) que deba ubicar prácticas de ITIL v4. Cubre **10 de las 34 prácticas** de ITIL v4 (las más relevantes para documentación operativa); no es el catálogo completo.

**Las 4 dimensiones de la gestión de servicio** (aplican a todas las prácticas): 1) Organización y personas, 2) Información y tecnología, 3) Socios y proveedores, 4) Valor y relaciones.

**Las 6 actividades de la cadena de valor de servicio** (nombres oficiales, usar siempre así): Planear · Mejorar · Involucrar · Diseñar y transición · Obtener/construir · Entrega y asistencia.

## Prácticas de gestión de ITIL — panorama general

ITIL v4 define 3 tipos de prácticas (34 en total), todas sujetas a las 4 dimensiones:

- **Prácticas de gestión general** (14): arquitectura, mejora continua, seguridad de la información, gestión del conocimiento, medición y reportes, cambio organizacional, portafolio, proyectos, relaciones, riesgo, financiera, estrategia, proveedores, fuerza laboral y talento.
- **Prácticas de gestión de servicio** (17): disponibilidad, análisis de negocio, capacidad y desempeño, habilitación de cambios, gestión de incidentes, activos de TI, monitoreo y eventos, gestión de problemas, gestión de versiones, catálogo de servicios, configuración de servicios, continuidad de servicio, diseño de servicio, mesa de servicio, nivel de servicio, solicitudes de servicio, validación y pruebas de servicio.
- **Prácticas de gestión técnica** (3): gestión de implementación, infraestructura y plataforma, desarrollo y gestión de software.

Una **práctica** = conjunto de recursos organizacionales diseñados para realizar un trabajo o lograr un objetivo.

---

## 1. Práctica de mejora continua
**Propósito:** alinear las prácticas y servicios de la organización con las necesidades cambiantes del negocio, mejorando continuamente productos, servicios y prácticas.

**Actividades clave:** fomentar la cultura de mejora, asegurar tiempo/presupuesto, identificar y registrar oportunidades, evaluarlas y priorizarlas, hacer casos de negocio, planificar e implementar, medir resultados, coordinar en toda la organización.

**Técnicas de evaluación del estado actual:** FODA (SWOT), cuadro de mando integral, auditorías internas/externas. Enfoques complementarios: LEAN (eliminar desperdicio), Ágil (mejoras incrementales), DevOps (aplicación efectiva end-to-end).

**Modelo de mejora continua (7 pasos, no lineales, con juicio crítico):**
1. ¿Cuál es la visión? → visión de negocio, misión, metas y objetivos
2. ¿Dónde estamos ahora? → evaluación de línea base (percepción de usuario, cultura, gente, procesos, tecnología)
3. ¿Dónde queremos estar? → metas medibles, SMART-CSF y KPIs
4. ¿Cómo llegamos ahí? → plan de mejora, experimentos, entregas iterativas
5. Tomar acción → ejecutar (cascada o ágil), medir progreso, gestionar riesgo
6. ¿Llegamos? → evaluar métricas/KPIs, validar éxito
7. ¿Cómo mantenemos el impulso? → comercializar éxitos, reforzar comportamientos, documentar lecciones aprendidas (gestión del conocimiento)

**Aporte principal a la cadena de valor:** Mejorar · Planear.

---

## 2. Control de cambios
**Propósito:** maximizar el número de cambios exitosos de servicio/producto, evaluando riesgos, autorizando cambios y administrando el programa de cambios.

**Cambio:** adición, modificación o eliminación de cualquier cosa con efecto directo o indirecto en los servicios.

**Conceptos clave:**
- **Autoridad de cambio:** persona/grupo que autoriza el cambio (debe asignarse correctamente según el tipo de cambio).
- **Cronograma de cambios:** planifica, comunica, evita conflictos y asigna recursos.

**Tres tipos de cambio:**
- **Normales:** requieren evaluación y autorización mediante un proceso (modelos según tipo/riesgo).
- **Estándar:** preautorizados, bajo riesgo, bien documentados; no requieren autorización adicional (a menudo vía solicitud de servicio).
- **Emergencia:** deben implementarse cuanto antes (ej. resolver incidente o parche de seguridad); evaluación/autorización expeditas, normalmente fuera del cronograma.

**Aporte principal a la cadena de valor:** Diseñar y transición · Planear · Entrega y asistencia.

---

## 3. Gestión de incidentes
**Propósito:** minimizar el impacto negativo de los incidentes restaurando el funcionamiento normal del servicio lo más rápido posible.

**Incidente:** interrupción no planificada o reducción de calidad de un servicio.

**Puntos clave:** registro y gestión de todo incidente; tiempos de resolución acordados/documentados/comunicados; priorización según impacto de negocio; incidentes de bajo impacto → gestión eficiente (bajo consumo de recursos); incidentes mayores → equipo temporal multidisciplinario, posible activación de planes de recuperación ante desastres; técnica de **enjambre (swarming)**: varios interesados trabajan juntos hasta identificar quién debe continuar.

**Aporte principal a la cadena de valor:** Entrega y asistencia · Involucrar · Mejorar (registros alimentan la gestión de problemas).

---

## 4. Gestión de problemas
**Propósito:** reducir la probabilidad e impacto de los incidentes identificando causas reales/potenciales y gestionando soluciones (workarounds) en áreas conocidas.

**Conceptos:**
- **Problema:** causa o causa potencial de uno o más incidentes.
- **Error conocido:** problema analizado pero no resuelto.
- **Workaround (solución alternativa):** reduce/elimina el impacto sin resolución completa; puede volverse permanente si resolver no es viable/rentable; se documenta en el registro del problema y se reevalúa su eficacia en cada uso.

**Tres fases:**
- *Identificación de problemas:* análisis de tendencias de incidentes, detección de duplicados/recurrentes, incidentes mayores, info de proveedores/socios/desarrolladores/pruebas/proyectos.
- *Control de problemas:* análisis y documentación de soluciones, priorización por riesgo/impacto/probabilidad, análisis desde las 4 dimensiones de gestión de servicio.
- *Control de errores:* una vez identificada la causa, se registra el **error conocido** y se gestiona hasta su resolución o se aprueba el workaround permanente; cada workaround se reevalúa en cada uso y se actualiza en el registro.

**Aporte principal a la cadena de valor:** Mejorar · Entrega y asistencia · Diseñar y transición.

---

## 5. Gestión de solicitudes de servicio
**Propósito:** respaldar la calidad acordada de un servicio manejando todas las solicitudes predefinidas e iniciadas por el usuario, de forma efectiva y fácil de usar.

**Solicitud de servicio:** acción acordada como parte normal de la prestación del servicio (NO es una falla, eso son incidentes). Puede ser: acción de entrega, solicitud de información, provisión de recurso/servicio, acceso, retroalimentación/quejas/felicitaciones.

**Guías:** estandarizar y automatizar al máximo; definir políticas de aprobación (limitada o nula) para simplificar; establecer expectativas realistas de tiempos de cumplimiento; buscar mejoras para tiempos más rápidos y más automatización.

**Aporte principal a la cadena de valor:** Entrega y asistencia · Involucrar · Mejorar.

---

## 6. Mesa de servicio (Service Desk)
**Propósito:** capturar la demanda de resolución de incidentes y solicitudes de servicio; punto único de contacto entre el proveedor y todos los usuarios.

**Puntos clave:** ruta clara para reportar, reconocer, clasificar, poseer y actuar sobre problemas/consultas/solicitudes; siempre habrá escalamiento a otros equipos (soporte/desarrollo deben colaborar estrechamente); no necesita ser altamente técnica, pero sí tiene gran influencia en la experiencia del usuario; habilidades clave del personal: empatía, análisis/priorización de incidentes, comunicación efectiva, inteligencia emocional; tecnologías habilitadoras: IA, RPA, chatbots, entre otras.

**Aporte principal a la cadena de valor:** Entrega y asistencia · Involucrar · Diseñar y transición.

---

## 7. Gestión del nivel de servicio (SLM / SLA)
**Propósito:** establecer objetivos claros de negocio para los niveles de servicio y garantizar que la prestación se evalúe, supervise y gestione conforme a ellos.

**Nivel de servicio:** una o más métricas que definen la calidad de servicio esperada/lograda.

**SLA (Acuerdo de Nivel de Servicio):** acuerdo documentado entre proveedor y cliente que identifica servicios requeridos y nivel de servicio esperado. Deben: relacionarse con resultados definidos (no solo métricas operativas), usar paquetes equilibrados de métricas (satisfacción del cliente + resultados de negocio), estar escritos de forma simple y clara para todas las partes.

**Fuentes de información:** compromiso del cliente, comentarios del cliente (encuestas, etc.), métricas operativas (disponibilidad, tiempos de respuesta a incidentes, tiempos de cambio/solicitud), métricas de negocio.

**Habilidades requeridas:** gestión de relaciones, enlace comercial, análisis de negocio, gestión de proveedores comerciales.

**Aporte principal a la cadena de valor:** Involucrar · Planear · Entrega y asistencia.

---

## Prácticas de gestión técnica

### 8. Gestión de implementación (Deployment management)
**Propósito:** mover hardware, documentación, procesos u otros componentes nuevos/modificados a entornos activos (o de prueba/staging). Trabaja de cerca con gestión de versiones y control de cambios, pero es una práctica separada.

**Enfoques de implementación:**
- **Por fases:** se implementa en partes del entorno (ej. una oficina/país) de forma repetida.
- **Entrega continua:** integración, prueba y despliegue frecuentes, con retroalimentación constante.
- **Big Bang:** todos los objetivos al mismo tiempo (necesario cuando hay dependencias incompatibles entre versiones).
- **Pull:** el software está disponible en un repositorio y el usuario decide cuándo descargarlo/actualizarlo.

**Aporte principal a la cadena de valor:** Diseñar y transición · Obtener/construir.

### 9. Gestión de infraestructura y plataforma
**Propósito:** supervisar la infraestructura y plataformas usadas por la organización (servidores, almacenamiento, redes, hardware cliente, middleware, sistemas operativos), sea propia o de terceros (dedicada, compartida, nube). Puede incluir edificios/instalaciones. Incluye estar preparado para adoptar nuevas tecnologías.

**Aporte principal a la cadena de valor:** Obtener/construir · Planear · Diseñar y transición.

### 10. Desarrollo y gestión de software
**Propósito:** garantizar que las aplicaciones satisfagan las necesidades de las partes interesadas internas/externas en funcionalidad, confiabilidad, mantenibilidad, cumplimiento y auditabilidad. "Software" incluye desde un programa único hasta sistemas operativos, apps móviles/escritorio, software embebido, sitios web.

**Actividades:** arquitectura de soluciones, diseño de soluciones (UI, diseño de servicios), desarrollo, pruebas (unitarias, integración, regresión, seguridad, aceptación de usuario), gestión de repositorios/librerías de código, empaquetado para despliegue, control de versiones.

**Ciclo de vida del software:** Ideación → Diseño (Design) → Desarrollo (Develop) → Prueba (Test) → Despliegue (Deploy) → Operación (Operate) → Retiro (Retire), con mejora continua a lo largo del ciclo.

**Aporte principal a la cadena de valor:** Diseñar y transición · Obtener/construir · Entrega y asistencia.

---

## Notas de uso para documentación de proyectos
- Cada práctica trae su **aporte principal a la cadena de valor**: úsalo para mapear microservicios/flujo de un proyecto (ej. en RodApp: Auth, Motorcycle, Reservation, Payment, Notification, API Gateway) a prácticas concretas.
- Los tipos de cambio (normal/estándar/emergencia) y las fases de gestión de problemas (identificación / control de problemas / control de errores) son buenos ejes para justificar decisiones de arquitectura y operación en documentación dirigida a alta dirección.
- Para documentación de proyectos usar la plantilla: `03-Plantillas/Documentacion-proyecto.md`.
