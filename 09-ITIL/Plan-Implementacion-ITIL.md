# D.Softworks — Plan de Implementación ITIL v4

**Fecha de creación:** 22 de septiembre de 2026
**Responsable:** Daniel (gestión) + Compañero (desarrollo)
**Objetivo:** Implementar las prácticas de ITIL v4 para mejorar la prestación de servicios digitales

---

## RESUMEN EJECUTIVO

ITIL v4 (Information Technology Infrastructure Library) es un marco de referencia para la gestión de servicios de TI. Aunque D.Softworks es una agencia pequeña (2 personas), implementar estas prácticas nos permitirá:

1. **Estandarizar** nuestros procesos de entrega
2. **Reducir** incidentes y problemas recurrentes
3. **Mejorar** la satisfacción del cliente
4. **Escalar** el negocio de forma ordenada
5. **Documentar** el conocimiento para futuros colaboradores

---

## MAPEO DE PRÁCTICAS ITIL → D.SOFTWORKS

### PRÁCTICAS DE GESTIÓN GENERAL

| Práctica ITIL | Aplicación en D.Softworks | Prioridad |
|---------------|---------------------------|-----------|
| **Mejora Continua** | Revisión semanal de procesos, capturar qué funcionó y qué no | ALTA |
| **Gestión del Conocimiento** | Base de conocimiento: soluciones a problemas comunes, guías de configuración | ALTA |
| **Gestión de Riesgos** | Identificar riesgos por proyecto (plazos, scope creep, pagos) | MEDIA |
| **Gestión de Proyectos** | Control de proyectos activos, seguimiento de avance | ALTA |
| **Gestión Financiera** | Control de costos por proyecto, márgenes de ganancia | MEDIA |

### PRÁCTICAS DE GESTIÓN DE SERVICIO

| Práctica ITIL | Aplicación en D.Softworks | Prioridad |
|---------------|---------------------------|-----------|
| **Gestión de Incidentes** | Manejar fallos en sitios entregados ( caídas, bugs, formularios rotos) | ALTA |
| **Gestión de Problemas** | Identificar causas raíz de incidentes recurrentes | MEDIA |
| **Gestión de Solicitudes de Servicio** | Manejar peticiones de clientes: cambios, actualizaciones, nuevos servicios | ALTA |
| **Mesa de Servicio** | Punto de contacto único para clientes (WhatsApp + email) | ALTA |
| **Gestión de Nivel de Servicio (SLA)** | Acuerdos claros de tiempos y calidad con clientes | ALTA |
| **Control de Cambios** | Proceso para modificar sitios web en producción | ALTA |
| **Gestión de Versiones** | Control de versiones vía GitHub | ALTA |

### PRÁCTICAS DE GESTIÓN TÉCNICA

| Práctica ITIL | Aplicación en D.Softworks | Prioridad |
|---------------|---------------------------|-----------|
| **Gestión de Implementación** | Despliegue a Netlify, GitHub Actions | ALTA |
| **Gestión de Infraestructura** | Netlify, Supabase, Namecheap, GitHub | ALTA |
| **Desarrollo y Gestión de Software** | Ciclo de vida: Ideación → Diseño → Desarrollo → Prueba → Despliegue → Operación | ALTA |

---

## PROCESOS IMPLEMENTADOS

### 1. GESTIÓN DE INCIDENTES

**Definición para D.Softworks:** Cualquier interrupción o reducción de calidad en un servicio entregado al cliente.

#### Tipos de Incidentes

| Tipo | Ejemplo | Prioridad | Tiempo de Respuesta |
|------|---------|-----------|---------------------|
| **Crítico** | Sitio web caído, dominio expirado, breach de seguridad | P1 | 1 hora |
| **Alto** | Formulario no funciona, enlace roto, SSL vencido | P2 | 4 horas |
| **Medio** | Imagen no carga, texto mal, diseño roto en móvil | P3 | 24 horas |
| **Bajo** | Solicitud de cambio menor, actualización de contenido | P4 | 48 horas |

#### Flujo de Gestión de Incidentes

```
1. RECEPCIÓN (Mesa de Servicio)
   - Cliente reporta vía WhatsApp/email
   - Se registra en hoja de seguimiento
   - Se clasifica por prioridad

2. ASIGNACIÓN
   - P1/P2: Daniel notifica al compañero inmediatamente
   - P3/P4: Se agenda para la próxima revisión

3. DIAGNÓSTICO
   - Identificar causa del problema
   - Revisar historial de cambios
   - Consultar base de conocimiento

4. RESOLUCIÓN
   - Implementar solución
   - Verificar que funciona
   - Comunicar al cliente

5. CIERRE
   - Confirmar con cliente que todo funciona
   - Documentar en base de conocimiento
   - Actualizar registro de incidentes
```

#### Plantilla de Registro de Incidente

```
## INCIDENTE #[Número]

**Fecha:** ___/___/______
**Cliente:** _______________
**Servicio afectado:** _______________
**Canal de reporte:** WhatsApp / Email / Otro

### Descripción del problema
_______________________________________________

### Clasificación
- **Prioridad:** P1 / P2 / P3 / P4
- **Tipo:** Caída / Bug / Diseño / Contenido / Otro

### Diagnóstico
- **Causa raíz:** _______________
- **Componente afectado:** Hosting / Dominio / Código / Configuración

### Resolución
- **Acción tomada:** _______________
- **Fecha/hora de resolución:** ___/___/ _____:____

### Cierre
- **Confirmado por cliente:** Sí / No
- **Documentado en KB:** Sí / No
```

---

### 2. GESTIÓN DE PROBLEMAS

**Definición para D.Softworks:** Causa o causa potencial de uno o más incidentes. Se diferencia de incidente porque el problema es la causa subyacente.

#### Ejemplos en D.Softworks

| Problema | Incidentes que causa | Solución |
|----------|---------------------|----------|
| Falta proceso de QA antes de entrega | Bugs reportados por clientes | Checklist de pre-entrega obligatorio |
| No se revisa SSL periódicamente | Sitios con certificado vencido | Monitoreo mensual de SSL |
| Dependencia de un solo desarrollador | Demoras cuando no está disponible | Documentar procesos, backup de código |
| No hay backup de configuraciones | Pérdida de configuración al migrar | GitHub como fuente única de verdad |

#### Flujo de Gestión de Problemas

```
1. IDENTIFICACIÓN
   - Revisar incidentes recurrentes (patrones)
   - Análisis de tendencias mensual
   - Feedback de clientes

2. ANÁLISIS
   - ¿Por qué ocurrió? (5 Porqués)
   - ¿Cuántos incidentes similares ha habido?
   - ¿Es un problema conocido?

3. PLAN DE SOLUCIÓN
   - Solución alternativa (workaround) inmediata
   - Solución permanente a planificar
   - Responsable y fecha

4. IMPLEMENTACIÓN
   - Ejecutar solución
   - Verificar que resuelve el problema
   - Actualizar base de conocimiento

5. REVISIÓN
   - ¿Se eliminaron los incidentes relacionados?
   - ¿Hay que ajustar el proceso?
```

#### Plantilla de Registro de Problema

```
## PROBLEMA #[Número]

**Fecha de identificación:** ___/___/______
**Incidentes relacionados:** _______________
**Cliente(s) afectado(s):** _______________

### Análisis
- **Descripción del problema:** _______________
- **Causa raíz identificada:** _______________
- **Impacto:** Alto / Medio / Bajo
- **Frecuencia:** Una vez / Ocasional / Frecuente

### Solución
- **Workaround (solución alternativa):** _______________
- **Solución permanente:** _______________
- **Responsable:** Daniel / Compañero
- **Fecha estimada:** ___/___/______

### Cierre
- **Solución implementada:** Sí / No
- **Verificado:** Sí / No
- **Documentado en KB:** Sí / No
```

---

### 3. GESTIÓN DE SOLICITUDES DE SERVICIO

**Definición para D.Softworks:** Peticiones predefinidas e iniciadas por el cliente que forman parte normal de la prestación del servicio (NO son fallos).

#### Tipos de Solicitudes

| Tipo | Ejemplo | Proceso |
|------|---------|---------|
| **Cambio de contenido** | "Quiero cambiar el texto de la sección de servicios" | Evaluar → Cotizar → Ejecutar |
| **Solicitud de información** | "¿Cómo puedo cambiar la foto de portada?" | Guiar al cliente |
| **Provisión de recurso** | "Necesito acceso al panel de Netlify" | Entregar credenciales |
| **Acceso** | "Quiero que mi empleado también pueda editar" | Configurar acceso |
| **Retroalimentación** | "Me gustaría que el formulario tuviera más campos" | Evaluar → Cotizar |

#### Flujo de Solicitudes

```
1. RECEPCIÓN
   - Cliente envía solicitud vía WhatsApp/email
   - Se registra en hoja de seguimiento

2. CLASIFICACIÓN
   - ¿Es un incidente (falla) o solicitud (petición)?
   - ¿Está dentro del alcance del servicio contratado?

3. EVALUACIÓN
   - Si es estándar (incluido): procesar
   - Si es adicional: cotizar y aprobar

4. EJECUCIÓN
   - Implementar cambio
   - Verificar funcionamiento

5. COMUNICACIÓN
   - Informar al cliente que está listo
   - Actualizar registro
```

#### Matriz de Solicitudes Estándar

| Solicitud | ¿Incluida? | Tiempo de respuesta |
|-----------|------------|---------------------|
| Cambio de texto en página | Sí (2 rondas incluidas) | 24-48h |
| Cambio de imagen principal | Sí (2 rondas incluidas) | 24-48h |
| Agregar nueva sección | No (cotización adicional) | 3-5 días |
| Cambiar colores del diseño | No (cotización adicional) | 2-3 días |
| Agregar formulario personalizado | No (cotización adicional) | 3-5 días |
| Configurar email corporativo | No (cotización adicional) | 1-2 días |
| Capacitación adicional | Sí (básica incluida) | Agendar |

---

### 4. MESA DE SERVICIO (SERVICE DESK)

**Definición para D.Softworks:** Punto único de contacto entre D.Softworks y todos los clientes.

#### Canales de Contacto

| Canal | Uso | Horario de respuesta |
|-------|-----|---------------------|
| **WhatsApp** | Principal: incidentes, solicitudes, consultas | Lun-Vie 9:00-18:00 |
| **Email** | Formal: cotizaciones, contratos, documentación | Lun-Vie 9:00-18:00 |
| **Facebook DM** | Consultas iniciales, prospección | Lun-Vie 9:00-18:00 |
| **Instagram DM** | Consultas iniciales, prospección | Lun-Vie 9:00-18:00 |

#### Proceso de Atención

```
1. RECEPCIÓN (0-5 min)
   - Responder "Recibimos tu mensaje, te atendemos en breve"
   - Clasificar: incidente / solicitud / consulta / prospecto

2. PRIMER CONTACTO (5-30 min)
   - Diagnosticar el caso
   - Dar primera respuesta o escalar

3. RESOLUCIÓN
   - Si se resuelve ahora: cerrar
   - Si necesita trabajo: crear registro y dar seguimiento

4. SEGUIMIENTO
   - Actualizar al cliente del avance
   - Confirmar resolución
```

#### Plantilla de Respuesta Rápida

```
## RESPUESTAS ESTÁNDAR

### Al recibir solicitud:
"¡Hola [Nombre]! Recibimos tu solicitud. Te atendemos en los próximos [X] minutos/horas. 🤝"

### Al diagnosticar:
"Entendido. El caso es [descripción]. Lo estamos revisando y te mantenemos informado."

### Al escalar:
"Este caso requiere revisión técnica. Lo estamos atendiendo y te tenemos respuesta antes de [fecha/hora]."

### Al resolver:
"¡Listo! [Descripción de lo que se hizo]. ¿Funciona correctamente desde tu lado?"

### Al cerrar:
"Perfecto, damos por cerrado este caso. Si necesitas algo más, aquí estamos. 🤝"
```

---

### 5. GESTIÓN DE NIVEL DE SERVICIO (SLA)

**Definición para D.Softworks:** Acuerdos documentados entre D.Softworks y el cliente sobre la calidad y tiempos de servicio esperados.

#### SLA Internos (Nuestros compromisos)

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| **Tiempo de respuesta a incidentes P1** | < 1 hora | Registro de timestamps |
| **Tiempo de respuesta a incidentes P2** | < 4 horas | Registro de timestamps |
| **Tiempo de entrega de proyectos** | Según cotización | Seguimiento de proyectos |
| **Tasa de entrega a tiempo** | > 90% | Métricas mensuales |
| **Satisfacción del cliente** | > 4/5 | Encuesta post-entrega |

#### SLA Externos (Lo que prometemos al cliente)

| Servicio | Tiempo de entrega | Cambios incluidos | Soporte post-entrega |
|----------|-------------------|-------------------|---------------------|
| Página Web Básica | 5-7 días hábiles | 2 rondas | 7 días de soporte |
| Landing Page | 3-5 días hábiles | 2 rondas | 7 días de soporte |
| Catálogo Digital | 3-4 días hábiles | 1 ronda | 3 días de soporte |
| Config. Redes Sociales | 1-2 días | — | 3 días de soporte |

#### Plantilla de Acuerdo con Cliente

```
## ACUERDO DE NIVEL DE SERVICIO — D.Softworks

**Cliente:** _______________
**Servicio:** _______________
**Fecha de inicio:** ___/___/______

### Compromisos de D.Softworks
- Entrega del servicio en ___ días hábiles
- ___ rondas de cambios incluidas
- Soporte post-entrega por ___ días
- Respuesta a incidentes críticos en ___ horas

### Compromisos del Cliente
- Proporcionar contenido (textos, fotos) en ___ días
- Revisar y aprobar entregas parciales en ___ días
- Realizar pagos según lo acordado

### Proceso de Cambios
- Cambios dentro del alcance: sin costo adicional
- Cambios fuera del alcance: se cotizan por separado
- Aprobación de cambios por escrito (WhatsApp/email)

### Escalamiento
- Nivel 1: Daniel (gestión, contacto con cliente)
- Nivel 2: Compañero (desarrollo técnico)
```

---

### 6. CONTROL DE CAMBIOS

**Definición para D.Softworks:** Proceso para evaluar, autorizar e implementar cambios en servicios entregados.

#### Tipos de Cambios en D.Softworks

| Tipo | Descripción | Requiere aprobación | Proceso |
|------|-------------|---------------------|---------|
| **Estándar** | Cambios predefinidos en el alcance | No (ya aprobados) | Ejecutar directo |
| **Normal** | Cambios que salen del alcance original | Sí (del cliente y Daniel) | Evaluar → Cotizar → Aprobar → Ejecutar |
| **Emergencia** | Fix de seguridad o sitio caído | Sí (solo Daniel) | Ejecutar → Documentar después |

#### Flujo de Control de Cambios

```
1. SOLICITUD
   - Cliente solicita cambio
   - Se registra en hoja de seguimiento

2. EVALUACIÓN
   - ¿Está dentro del alcance?
   - ¿Cuánto tiempo tomará?
   - ¿Afecta otros componentes?
   - ¿Hay riesgo?

3. DECISIÓN
   - APROBAR: Continuar con el cambio
   - RECHAZAR: Explicar al cliente por qué
   - MODIFICAR: Proponer alternativa

4. EJECUCIÓN
   - Implementar en entorno de desarrollo/pruebas
   - Verificar que funciona
   - Despliegue a producción

5. DOCUMENTACIÓN
   - Actualizar registro de cambios
   - Actualizar documentación del proyecto
   - Notificar al cliente
```

#### Registro de Cambios

```
## CAMBIO #[Número]

**Fecha:** ___/___/______
**Cliente:** _______________
**Servicio:** _______________

### Descripción del cambio
_______________________________________________

### Tipo
- [ ] Estándar (incluido en alcance)
- [ ] Normal (fuera de alcance)
- [ ] Emergencia (crítico)

### Evaluación
- **Tiempo estimado:** ___ horas
- **Costo adicional:** $___ MXN
- **Riesgo:** Bajo / Medio / Alto
- **Aprobado por:** Cliente / Daniel

### Implementación
- **Fecha de implementación:** ___/___/______
- **Estado:** Pendiente / En progreso / Completado
- **Verificado:** Sí / No
```

---

### 7. MEJORA CONTINUA

**Definición para D.Softworks:** Cultura de mejorar continuamente productos, servicios y prácticas.

#### Ciclo de Mejora Continua (7 pasos adaptados)

```
1. ¿CUÁL ES LA VISIÓN?
   → Ser la agencia de referencia para negocios locales en Guadalajara

2. ¿DÓNDE ESTAMOS AHORA?
   → Evaluación mensual: clientes, ingresos, satisfacción, procesos

3. ¿DÓNDE QUEREMOS ESTAR?
   → Objetivos SMART: 5 clientes/mes, 95% satisfacción, 0 incidentes críticos

4. ¿CÓMO LLEGAMOS AHÍ?
   → Plan de mejora: capacitación, herramientas, procesos

5. TOMAR ACCIÓN
   → Ejecutar mejoras, medir progreso

6. ¿LLEGAMOS?
   → Evaluar métricas vs objetivos

7. ¿CÓMO MANTENEMOS EL IMPULSO?
   → Documentar lecciones, reforzar comportamientos exitosos
```

#### Revisión Mensual de Mejora Continua

```
## REPORTE DE MEJORA CONTINUA — MES ___/2026

### 1. MÉTRICAS DEL MES
| Métrica | Objetivo | Real | Estado |
|---------|----------|------|--------|
| Clientes cerrados | 5 | | |
| Entregas a tiempo | 90% | | |
| Incidentes reportados | < 3 | | |
| Satisfacción promedio | > 4/5 | | |
| Ingresos totales | $___ | | |

### 2. ¿QUÉ FUNCIONÓ?
- 
- 

### 3. ¿QUÉ NO FUNCIONÓ?
- 
- 

### 4. MEJORAS PROPUESTAS
| Mejora | Responsable | Fecha | Estado |
|--------|-------------|-------|--------|
| | | | |

### 5. LECCIONES APRENDIDAS
- 
- 
```

---

### 8. GESTIÓN DEL CONOCIMIENTO

**Definición para D.Softworks:** Base de conocimiento con soluciones a problemas comunes, guías y mejores prácticas.

#### Estructura de la Base de Conocimiento

```
📁 Base de Conocimiento D.Softworks/
├── 📁 Problemas Conocidos/
│   ├── Sitio caído en Netlify.md
│   ├── SSL vencido.md
│   ├── Formulario no funciona.md
│   └── Dominio no apunta.md
├── 📁 Soluciones/
│   ├── Configurar Netlify.md
│   ├── Configurar SSL.md
│   ├── Configurar dominio.md
│   └── Configurar Supabase.md
├── 📁 Guías/
│   ├── Checklist pre-entrega.md
│   ├── Guía de Despliegue.md
│   └── Guía de Postventa.md
└── 📁 Plantillas/
    ├── Plantilla incidente.md
    ├── Plantilla problema.md
    └── Plantilla cambio.md
```

#### Entradas de Ejemplo

**Problema Conocido: Sitio caído en Netlify**
```
## Sitio caído en Netlify

### Síntomas
- El sitio no carga
- Error 404 o 502
- El cliente reporta que "no funciona"

### Causas posibles
1. Límite de bandwidth excedido (plan gratuito)
2. Build fallido en GitHub
3. Configuración de dominio incorrecta
4. Archivos corruptos en el repositorio

### Solución paso a paso
1. Entrar a Netlify → Seleccionar sitio → Deploys
2. Verificar si hay builds fallidos
3. Si hay build fallido: revisar logs, corregir error, redeploy
4. Si no hay build fallido: revisar configuración de dominio
5. Verificar que el dominio apunta a Netlify
6. Probar en diferentes dispositivos

### Prevención
- Monitorear builds semanalmente
- Mantener repositorio limpio
- Usar Netlify CLI para deploys locales antes de push
```

---

### 9. GESTIÓN DE IMPLEMENTACIÓN

**Definición para D.Softworks:** Mover componentes nuevos o modificados a entornos activos.

#### Enfoques de Implementación en D.Softworks

| Enfoque | Cuándo usarlo | Ejemplo |
|---------|---------------|---------|
| **Entrega continua** | Desarrollo web (nuestro caso principal) | Push a GitHub → Netlify deploy automático |
| **Por fases** | Proyectos grandes con múltiples entregas | Primero landing, después catálogo |
| **Big Bang** | Cuando hay dependencias | Migrar todo el sitio de un dominio a otro |
| **Pull** | Cuando el cliente controla la actualización | Cliente sube sus propias fotos al catálogo |

#### Flujo de Despliegue Estándar

```
1. DESARROLLO
   - Código en rama feature/ o fix/
   - Pruebas locales

2. REVISIÓN
   - Code review (si aplica)
   - Verificar checklist pre-entrega

3. INTEGRACIÓN
   - Merge a rama main
   - Push a GitHub

4. DESPLIEGUE
   - Netlify deploy automático
   - Verificar en producción

5. VERIFICACIÓN
   - Probar funcionalidad
   - Verificar en móvil y desktop
   - Confirmar con cliente (si aplica)

6. DOCUMENTACIÓN
   - Actualizar registro de cambios
   - Actualizar base de conocimiento
```

---

### 10. DESARROLLO Y GESTIÓN DE SOFTWARE

**Definición para D.Softworks:** Garantizar que las aplicaciones satisfagan necesidades en funcionalidad, confiabilidad y mantenibilidad.

#### Ciclo de Vida del Software en D.Softworks

```
IDEACIÓN → DISEÑO → DESARROLLO → PRUEBA → DESPLIEGUE → OPERACIÓN → RETIRO
    ↓         ↓          ↓           ↓          ↓            ↓          ↓
  Cliente   Figma/    HTML/CSS/   Checklist   GitHub→    Monitoreo   Migrar a
 需求      Canva      JS         QA         Netlify    + Soporte   nueva versión
```

#### Actividades por Fase

| Fase | Actividades | Responsable | Herramienta |
|------|-------------|-------------|-------------|
| **Ideación** | Reunión con cliente, diagnóstico, alcance | Daniel | WhatsApp, reunión |
| **Diseño** | Wireframe, mockup, aprobación visual | Daniel/Compañero | Canva, Figma |
| **Desarrollo** | Coding, configuración, integraciones | Compañero | VS Code, GitHub |
| **Prueba** | QA funcional, responsive, rendimiento | Ambos | Checklist QA |
| **Despliegue** | Deploy a Netlify, configuración dominio | Compañero | Netlify, Namecheap |
| **Operación** | Monitoreo, soporte, incidentes | Daniel | WhatsApp, hoja seguimiento |
| **Retiro** | Migración a nuevo servicio, cierre | Daniel | — |

---

## INTEGRACIÓN CON EL SISTEMA OPERATIVO ACTUAL

### Archivos Existentes que se Actualizan

| Archivo | Cambio necesario |
|---------|------------------|
| `06-Clientes/Checklists-entrega.md` | Agregar paso de QA pre-entrega |
| `06-Clientes/Postventa.md` | Agregar proceso de incidentes |
| `PLAN-DE-ACCION.md` | Agregar Fase 6: Implementación ITIL |
| `AGENTS.md` | Agregar referencia a prácticas ITIL |

### Nuevos Archivos a Crear

| Archivo | Propósito |
|---------|-----------|
| `09-ITIL/Plan-Implementacion-ITIL.md` | Este documento |
| `09-ITIL/Registro-Incidentes.md` | Log de incidentes |
| `09-ITIL/Registro-Problemas.md` | Log de problemas |
| `09-ITIL/Registro-Cambios.md` | Log de cambios |
| `09-ITIL/Base-Conocimiento/` | KB con soluciones conocidas |
| `09-ITIL/Metricas-Mensuales.md` | Tracking de métricas ITIL |

---

## PRIORIDADES DE IMPLEMENTACIÓN

### FASE 1: Implementar AHORA (Semana 1)

1. **Mesa de servicio** → Definir canales y horarios de atención
2. **Gestión de incidentes** → Crear registro y flujo básico
3. **SLA internos** → Definir tiempos de respuesta
4. **Checklist pre-entrega** → Agregar QA obligatorio

### FASE 2: Implementar PRONTO (Semana 2-3)

5. **Gestión de solicitudes** → Matriz de solicitudes estándar
6. **Control de cambios** → Proceso para cambios fuera de alcance
7. **Base de conocimiento** → Crear primeras entradas
8. **Registro de problemas** → Empezar a documentar

### FASE 3: Implementar CUANDO ESCALE (Mes 2+)

9. **Mejora continua** → Revisión mensual formal
10. **Gestión de conocimiento** → Expandir KB
11. **SLA externos** → Acuerdos formales con clientes
12. **Métricas y reportes** → Dashboard de KPIs

---

## BENEFICIOS ESPERADOS

| Antes de ITIL | Después de ITIL |
|---------------|-----------------|
| Incidentes manejados al vapor | Incidentes clasificados y resueltos con proceso |
| Sin registro de problemas | Problemas identificados y prevenidos |
| Cambios sin control | Cambios evaluados y documentados |
| Sin acuerdos claros | SLA definidos y comunicados |
| Conocimiento en la cabeza | Base de conocimiento documentada |
| Sin métricas | KPIs medidos mensualmente |

---

## CHECKLIST DE IMPLEMENTACIÓN

### Semana 1
- [ ] Crear carpeta `09-ITIL/`
- [ ] Crear plantilla de registro de incidentes
- [ ] Definir canales de atención (Mesa de Servicio)
- [ ] Definir tiempos de respuesta (SLA internos)
- [ ] Actualizar checklist de entrega con QA

### Semana 2
- [ ] Crear matriz de solicitudes estándar
- [ ] Crear proceso de control de cambios
- [ ] Crear primeras entradas de base de conocimiento
- [ ] Crear plantilla de registro de problemas

### Semana 3
- [ ] Crear plantilla de acuerdo con cliente (SLA externo)
- [ ] Crear registro de cambios
- [ ] Documentar primer problema resuelto
- [ ] Crear plantilla de mejora continua

### Mes 2
- [ ] Primera revisión de mejora continua
- [ ] Expandir base de conocimiento (5+ entradas)
- [ ] Revisar métricas vs objetivos
- [ ] Ajustar procesos según aprendizaje

---

**D.Softworks — Soluciones Digitales**
**Documento creado:** 22 de septiembre de 2026
**Versión:** 1.0