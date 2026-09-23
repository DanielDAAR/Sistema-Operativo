# D.Softworks — Automatización y Plan de Contratación

**Fecha de creación:** 22 de septiembre de 2026
**Objetivo:** Automatizar procesos, definir cuándo contratar y planificar cómo soportar salarios

---

## PARTE 1: AUTOMATIZACIÓN DE PROCESOS

### ¿Qué se puede automatizar HOY (sin costo)?

#### 1. Despliegue Automático (ya lo tienes)
```
Código → GitHub → Netlify deploy automático
```
- **Costo:** $0
- **Ahorro:** ~30 min por proyecto

#### 2. Formularios de Contacto con Notificaciones
```
Cliente llena formulario → Email automático a Daniel → Guarda en Supabase
```
- **Herramienta:** Netlify Forms + Email notification
- **Costo:** $0
- **Ahorro:** ~15 min por lead

#### 3. Seguimiento Automático por Email
```
Día 7 después de entrega → Email automatorio de seguimiento
Día 30 → Email de oportunidad de mantenimiento
Día 60 → Email de renovación
```
- **Herramienta:** Brevo (ex Sendinblue) — gratis hasta 300 emails/día
- **Costo:** $0
- **Ahorro:** ~1 hora por cliente

#### 4. Recordatorios de Pago
```
5 días antes de vencimiento → WhatsApp automático de recordatorio
```
- **Herramienta:** WhatsApp Business + respuestas guardadas
- **Costo:** $0
- **Ahorro:** ~20 min por cliente

#### 5. Registro Automático de Prospectos
```
Mensaje de Facebook/Instagram → Guarda en Google Sheets automáticamente
```
- **Herramienta:** Make.com (ex Integromat) — gratis hasta 1000 operaciones/mes
- **Costo:** $0
- **Ahorro:** ~10 min por prospecto

---

### Automatización con Herramientas Gratuitas

| Herramienta | Para qué | Plan gratis | Costo si escalas |
|-------------|----------|-------------|------------------|
| **Make.com** | Conectar apps, automatizar flujos | 1000 ops/mes | $9 USD/mes |
| **Brevo** | Email marketing, transaccional | 300 emails/día | $25 USD/mes |
| **Trello** | Gestión de proyectos | 10 tableros | $5 USD/mes |
| **Notion** | Base de conocimiento, wiki | 1000 bloques | $8 USD/mes |
| **Google Sheets** | CRM, contabilidad | Gratis | — |
| **WhatsApp Business** | Atención al cliente | Gratis | — |

---

### Flujos Automatizados Recomendados

#### Flujo 1: Nuevo Lead (Prospecto)
```
[Facebook/Instagram DM] 
    ↓
[Make.com detecta mensaje] 
    ↓
[Guarda en Google Sheets: nombre, negocio, teléfono, fecha]
    ↓
[Envía email a Daniel: "Nuevo lead: [nombre]"]
    ↓
[WhatsApp Business: envía respuesta automática de recibido]
```

**Configuración en Make.com:**
1. Crear cuenta gratis en make.com
2. Conectar Facebook/Instagram
3. Conectar Google Sheets
4. Configurar: "Cuando llegue mensaje → Guardar en fila → Enviar email"

#### Flujo 2: Post-Entrega Automatizado
```
[Día 0: Entrega del proyecto]
    ↓
[Daniel marca "entregado" en Google Sheets]
    ↓
[Día 7: Brevo envía email de seguimiento automático]
    ↓
[Día 30: Brevo envía email de oportunidad]
    ↓
[Día 60: Brevo envía email de mantenimiento]
```

**Email de seguimiento (Día 7):**
```
Asunto: ¿Cómo te fue con tu nueva página web?

Hola [Nombre],

¿Cómo está todo con tu página web? ¿Funciona correctamente?

Si tienes alguna duda o necesitas algún ajuste, aquí estamos para ayudarte.

Saludos,
D.Softworks — Soluciones Digitales
```

#### Flujo 3: Recordatorio de Pago
```
[5 días antes del vencimiento]
    ↓
[Google Sheets detecta fecha de pago]
    ↓
[Make.com envía WhatsApp automático]
    ↓
[Mensaje: "Hola [Nombre], solo recordarte que tu pago de $[monto] vence en 5 días. 
¿Necesitas algún dato para la transferencia?"]
```

---

### Prioridades de Automatización

| # | Proceso | Impacto | Dificultad | Costo | Hacer ahora |
|---|---------|---------|------------|-------|-------------|
| 1 | Despliegue automático | ALTO | Baja | $0 | ✅ Ya hecho |
| 2 | Registro de leads | ALTO | Baja | $0 | ✅ Hacer ahora |
| 3 | Email seguimiento post-venta | ALTO | Media | $0 | ✅ Hacer ahora |
| 4 | Recordatorios de pago | MEDIO | Baja | $0 | ⏳ Semana 2 |
| 5 | Respuesta automática WhatsApp | MEDIO | Baja | $0 | ⏳ Semana 2 |
| 6 | Reporte automático mensual | BAJO | Media | $0 | ⏳ Mes 2 |

---

## PARTE 2: PLAN DE CONTRATACIÓN

### ¿Cuándo contratar?

**Regla de oro:** No contratar hasta que el ingreso lo soporte y el trabajo lo requiera.

#### Niveles de Crecimiento

| Nivel | Ingresos mensuales | Equipo | Qué hacer |
|-------|-------------------|--------|-----------|
| **0 — Solo** | $0 - $15,000 | Solo Daniel | No contratar, optimizar procesos |
| **1 — Primer ayudante** | $15,000 - $30,000 | Daniel + 1 freelance | Contratar por proyecto |
| **2 — Empleado básico** | $30,000 - $60,000 | Daniel + 1 empleado | Primer empleado de tiempo completo |
| **3 — Equipo pequeño** | $60,000 - $120,000 | Daniel + 2-3 empleados | Departamentalizar |
| **4 — Empresa** | $120,000+ | Equipo completo | Estructura formal |

---

### Nivel 0: Solo Daniel (Ingresos $0-$15,000/mes)

**Qué hacer:**
- No contratar a nadie
- Automatizar todo lo posible
- Usar freelancers por proyecto específico
- Enfocarse en vender y entregar

**Cuándo pasar al Nivel 1:**
- Estás facturando > $15,000/mes por 3 meses consecutivos
- Tienes más proyectos de los que puedes solo
- Estás perdiendo clientes por falta de tiempo

---

### Nivel 1: Primer Ayudante Freelance (Ingresos $15,000-$30,000/mes)

**Quién:** Freelancer de desarrollo web
**Cuándo:** Por proyecto específico, no de planta
**Cuánto:** $3,000-$8,000 por proyecto (según complejidad)

**Cómo encontrar:**
- Grupos de Facebook de desarrolladores
- Fiverr / Workana / Freepik
- Referidos de otros desarrolladores

**Flujo de trabajo:**
```
Daniel vende → Daniel asigna al freelance → Freelance desarrolla 
→ Daniel revisa → Daniel entrega al cliente
```

**Reglas:**
- Siempre firmar contrato de confidencialidad (NDA)
- Pagar por entregable, no por horas
- Revisar TODO antes de entregar al cliente
- Nunca dar acceso directo al cliente

**Costo estimado:**
| Proyecto | Precio venta | Pago freelance | Ganancia Daniel |
|----------|--------------|----------------|-----------------|
| Página web | $1,500 | $500-$800 | $700-$1,000 |
| Landing | $1,200 | $400-$600 | $600-$800 |
| Tienda en línea | $3,500 | $1,500-$2,000 | $1,500-$2,000 |

---

### Nivel 2: Primer Empleado de Tiempo Completo (Ingresos $30,000-$60,000/mes)

**Quién:** Desarrollador web/junior
**Cuándo:** Cuando tengas proyectos constantes (mínimo 4/mes)
**Cuánto:** $8,000-$15,000 MXN brutos/mes

**Requisitos del candidato:**
- Sabe HTML, CSS, JavaScript
- Conoce GitHub
- Ha trabajado con frameworks (React, Vue, o similar)
- Disponibilidad tiempo completo
- Ganas de aprender

**Costo REAL de un empleado en México:**

| Concepto | Monto | Notas |
|----------|-------|-------|
| **Sueldo neto** | $10,000 | Lo que recibe el empleado |
| **IMSS (patronal)** | ~$2,500 | 25% approx del sueldo |
| **ISR (retención)** | ~$1,200 | Se descuenta del empleado |
| **Cuota obrero-patronal** | ~$500 | Parte del empleado |
| **Vacaciones** | ~$833 | 12 días = 1 sueldo/12 |
| **Prima vacacional** | ~$250 | 25% de vacaciones |
| **Aguinaldo** | ~$833 | 15 días = 1 sueldo/12 |
| **Prima dominical** | ~$400 | Si trabaja domingos |
| **TOTAL COSTO EMPLEADOR** | **~$14,500** | |

**Fórmula:** Costo real = Sueldo neto × 1.4 a 1.5

**Para un empleado de $10,000 netos, necesitas:**
- **$14,000-$15,000 MXN/mes** de presupuesto total

---

### Nivel 3: Equipo Pequeño (Ingresos $60,000-$120,000/mes)

| Rol | Sueldo neto | Costo total | Cuándo contratar |
|-----|-------------|-------------|------------------|
| Desarrollador 1 | $12,000 | ~$17,000 | Ya tienes |
| Desarrollador 2 | $10,000 | ~$14,000 | Cuando haya backlog |
| Diseñador | $10,000 | ~$14,000 | Cuando haya diseño constante |
| Ventas/CS | $8,000 | ~$11,000 | Cuando no puedas vender solo |

**Costo mensual del equipo:** ~$56,000 MXN
**Ingresos mínimos necesarios:** ~$80,000 MXN/mes (para tener ganancia)

---

## PARTE 3: PLAN FINANCIERO PARA SOPORTAR SALARIOS

### Análisis de Ingresos Necesarios

#### Para contratar a 1 empleado ($10,000 netos)

| Dato | Valor |
|------|-------|
| **Costo total del empleado** | $14,500 MXN/mes |
| **Ganancia neta deseada** | $10,000 MXN/mes (para Daniel) |
| **Ingresos brutos necesarios** | $24,500 MXN/mes |
| **Proyectos a $1,500** | ~17 proyectos/mes |
| **Proyectos a $2,000** | ~13 proyectos/mes |

**Realidad:** 17 proyectos/mes es mucho para empezar.

#### Alternativa más realista

**Empezar con freelance por proyecto:**
- Ingresos: $20,000/mes
- Freelance: $8,000/mes (5 proyectos)
- Costos fijos: $2,000/mes
- Ganancia Daniel: $10,000/mes

---

### Modelo de Negocio Sostenible

#### Precio Promedio por Proyecto

| Servicio | Precio | Frecuencia esperada |
|----------|--------|---------------------|
| Página web | $1,500 | 8/mes |
| Landing page | $1,200 | 5/mes |
| Catálogo digital | $800 | 4/mes |
| Config. redes | $600 | 3/mes |
| **Promedio ponderado** | **~$1,200** | |

#### Proyección de Ingresos

| Mes | Proyectos | Ingresos | Costos | Ganancia |
|-----|-----------|----------|--------|----------|
| 1-3 | 5 | $6,000 | $500 | $5,500 |
| 4-6 | 10 | $12,000 | $1,000 | $11,000 |
| 7-9 | 15 | $18,000 | $2,000 | $16,000 |
| 10-12 | 20 | $24,000 | $3,000 | $21,000 |

**Punto para contratar primer freelance:** ~$15,000/mes sostenidos
**Punto para primer empleado:** ~$30,000/mes sostenidos

---

### Fórmula para Decidir si Puedes Contratar

```
¿Puedo contratar? = SI TODOS se cumplen:

1. Ingresos últimos 3 meses > $20,000/mes
2. Tengo backlog de proyectos (3+ en espera)
3. Estoy trabajando > 40 horas/semana
4. Tengo fondo de reserva para 2 meses de salario
5. El costo del empleado < 30% de mis ingresos
```

---

## PARTE 4: OBLIGACIONES LABORALES EN MÉXICO

### Si contratas formalmente (con contrato)

| Obligación | Cuándo | Monto |
|------------|--------|-------|
| **IMSS** | Mensual | ~25% del sueldo |
| **ISR** | Mensual | Según tabla (1-35%) |
| **Cuota obrero-patronal** | Mensual | ~5% del sueldo |
| **Vacaciones** | Anual | 12 días (primer año) |
| **Prima vacacional** | Anual | 25% de vacaciones |
| **Aguinaldo** | Anual | 15 días mínimos |
| **Prima dominical** | Semanal | 25% extra por domingo |
| **Utilidades** | Anual | 10% de utilidades (si > $3M ganancia) |

### Alternativas para Empezar

| Opción | Ventajas | Desventajas | Cuándo usarla |
|--------|----------|-------------|---------------|
| **Freelance por proyecto** | Sin obligaciones, flexible | Sin beneficios, puede dejar el proyecto | Ingresos < $20,000 |
| **Honorarios (recibo de honorarios)** | Simple, legal | Sin prestaciones | Freelance estable |
| **Contrato por obra determinada** | Legal, definido | Obligaciones patronales | Proyecto específico |
| **Contrato indefinite** | Estable, profesional | Todas las obligaciones | Empleado de planta |

---

### Paso a Paso para Contratar Legalmente

#### Opción A: Freelance (recomendado para empezar)

1. **Encontrar al freelance**
2. **Firmar contrato de prestación de servicios** (usar plantilla de `10-Infraestructura-Empresarial/`)
3. **Pagar por transferencia** (guardar comprobante)
4. **Recibir factura** (si el freelance factura)
5. **Registrar gasto** en hoja de contabilidad

**No necesitas:**
- Inscribirlo al IMSS
- Pagar prestaciones
- Retener impuestos (el freelance factura)

#### Opción B: Empleado Formal

1. **Definir puesto y sueldo**
2. **Buscar candidatos** (LinkedIn, grupos de Facebook, referidos)
3. **Entrevistar y seleccionar**
4. **Firmar contrato laboral**
5. **Inscribirlo al IMSS** (dentro de 5 días de contratación)
6. **Configurar nómina** (Calcular retenciones)
7. **Pagar quincenal/mensual**
8. ** declarar impuestos** (DIM anual)

---

## PARTE 5: HERRAMIENTAS DE AUTOMATIZACIÓN GRATUITAS

### Para Registrar Leads (CRM Básico)

**Google Sheets — Estructura:**

| Fecha | Nombre | Negocio | Teléfono | Facebook | Estado | Notas | Asignado a |
|-------|--------|---------|----------|----------|--------|-------|------------|
| | | | | | Prospecto/Contactado/Cotización/Cerrado | | Daniel/Freelance |

### Para Gestión de Proyectos

**Trello — Tablero:**

```
📋 Por hacer → 🔨 En progreso → 👀 Revisión → ✅ Entregado → 💰 Cobrado
```

### Para Email Marketing

**Brevo — Secuencias automáticas:**
1. Email de bienvenida (cuando subscribe)
2. Email seguimiento post-venta (Día 7)
3. Email oportunidad mantenimiento (Día 30)
4. Email renovación (Día 60)

### Para Comunicación

**WhatsApp Business — Respuestas guardadas:**
- Mensaje de recibido
- Confirmación de pago
- Recordatorio de entrega
- Seguimiento post-venta

---

## CHECKLIST DE IMPLEMENTACIÓN

### Semana 1 — Automatización Básica
- [ ] Crear cuenta en Make.com (gratis)
- [ ] Conectar Facebook/Instagram con Google Sheets
- [ ] Configurar registro automático de leads
- [ ] Crear cuenta en Brevo (gratis)
- [ ] Configurar email de seguimiento Día 7

### Semana 2 — CRM y Gestión
- [ ] Crear Google Sheets de CRM
- [ ] Crear tablero de Trello
- [ ] Configurar respuestas guardadas en WhatsApp Business
- [ ] Configurar recordatorios de pago

### Semana 3 — Preparación para Contratar
- [ ] Definir cuándo necesitas ayuda
- [ ] Crear perfil del primer freelance
- [ ] Preparar contrato de prestación de servicios
- [ ] Crear NDA (acuerdo de confidencialidad)

### Semana 4 — Prueba
- [ ] Probar flujo completo automatizado
- [ ] Ajustar lo que no funcione
- [ ] Documentar procesos
- [ ] Evaluar si necesitas contratar

---

## RESUMEN EJECUTIVO

| Área | Estado actual | Próximo paso |
|------|---------------|--------------|
| **Automatización** | Manual todo | Configurar Make.com + Brevo |
| **CRM** | Google Sheets básico | Agregar automatización |
| **Contratación** | Solo Daniel | Freelance cuando haya backlog |
| **Nómina** | No aplica | Formal cuando ingresas > $30k |
| **Costos** | $0 fijos | Mantener bajo hasta escalar |

### Regla de Oro

> **No contrates hasta que el trabajo te ahogue Y los ingresos lo permitan.**
> 
> Primero automatiza, después freelancers por proyecto, después empleado de planta.

---

**D.Softworks — Soluciones Digitales**
**Documento creado:** 22 de septiembre de 2026
**Versión:** 1.0