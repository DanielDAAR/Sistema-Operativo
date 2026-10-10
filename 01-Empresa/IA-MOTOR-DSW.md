# IA APLICADA A D.SOFTWORKS — El mapa de herramientas reales (octubre 2026)

**Investigado en la red: 9 de octubre de 2026.**
**Para quién:** Daniel + César.
**Cómo leer esto:** no es una lista de cosas bonitas. Es **tu operación de venta convertida en software**, con precios verificados y qué parte se paga sola.

---

## 0. LA VEREDAD QUE NO TE VA A GUSTAR

Pediste "algo revolucionario que no se ha pensado nunca".

**Eso no existe.** Y te explico por qué en tus propios términos: si existiera, ya lo construyó alguien, y ese alguien ya te ganó. No estás compitiendo por inventar; estás compitiendo por **usar mejor lo que existe antes de que tu competencia lo descubra**.

Pero tu intuición tiene razón en lo importante: **la IA sí cambió las reglas**, y tu equipo ya tiene algo que casi ningún freelancer tiene:

```
LOS FREELANCERS QUE "USAN IA":  ChatGPT + Canva + Wix
TÚ TIENES:                       DSW-OS (app en la nube, Supabase, Netlify)
                                 Netlify Functions · Auth · WhatsApp API
                                 60 documentos de proceso real
                                 Un pipeline mapeado con números
```

Eso no es una arranque tardía. Es una posición que se gana con trabajo. La IA es el multiplicador de lo que ya construiste — **no el sustituto**.

Y aquí está el dato que decide todo lo que sigue:

> **Meta cambió la tariff de WhatsApp el 1 de octubre de 2026.** Tu número +52 ahora tiene **1,000 mensajes de servicio gratis al mes**. Entraste al mes exacto en que el gratis se acabó.

---

## 1. EL HALLAZGO #1 — La economía de WhatsApp cambió esta semana

**Tarifas oficiales de Meta para México, vigentes 1-oct-2026:**

| Categoría | Precio por mensaje entregado | Nota |
|-----------|------------------------------|------|
| **Marketing** | $0.7298 MXN (+IVA) | Subió 30% — era $0.5614 |
| **Servicio** (tú respondes) | $0.1565 MXN (+IVA) | **Antes gratis. Ahora se cobra.** |
| **Utilidad** | $0.1565 MXN (+IVA) | |
| **Autenticación** | $0.1565 MXN (+IVA) | |
| **Lo que te escribe el cliente** | **GRATIS** | Siempre fue gratis, sigue siéndolo |
| **Free tier** | **1,000 mensajes de servicio gratis/mes por número** | No acumula, se reinicia cada mes |

**Lo que esto significa para ti — y es una oportunidad disfrazada de noticia mala:**

1. **Los primeros 1,000 mensajes al mes son gratis.** Tu meta son 50 contactos/semana = ~200/mes. **Caben 5 veces dentro del free tier.** No vas a pagar nada por WhatsApp oficial.
2. **Los mensajes que te llegan son gratis.** Cada conversación de venta son ~8 mensajes tuyos → **$1.25 MXN por conversación.** Insignificante.
3. **Más importante: esto mata la ventaja del spam barato.** Antes podías mandar 500 blasts baratos. Ahora el costo subió 30%, y el riesgo de baneo por enviar frío sin opt-in sigue igual.

**La consecuencia estratégica:** si automatizas, automatiza **conversaciones iniciadas por el cliente** (gratis), no blasts fríos. Un formulario en tu web → click a WhatsApp → ventana de 72 horas **gratis**. Ese es el canal.

---

## 2. EL HALLAZGO #2 — Existe la categoría completa que buscas

Investigé lo que hay hoy. Esto es lo real, con precios de México verificados:

### Capa 1 — Automatización (el "motor")

| Herramienta | Qué hace | Precio real | Para ti |
|-------------|----------|-------------|---------|
| **n8n self-hosted** | Workflows + agentes IA, código ilimitado | **$0** (solo VPS $5-20 USD/mes) | ✅ **La opción correcta.** Tú sabes Netlify/Supabase, n8n es el mismo idioma |
| Make | Visual, 3,000+ apps, agentes IA (beta) | Free 1,000 ops/mes · Core $9 USD | Buena, pero IA en beta |
| Zapier | 8,000+ apps | Free = **solo 2 pasos** · Pro $19.99 | **Descartada**: se paga por tarea y castiga la complejidad |

**Por qué n8n gana aquí, con números:**

Un flujo de 15 pasos con IA corriendo 200 veces al mes:

| Plataforma | Unidad | Costo |
|------------|--------|-------|
| Zapier | por tarea | ~$200+ USD/mes |
| Make | por operación | ~$30 USD/mes |
| **n8n self-hosted** | **por ejecución (todo el flujo = 1)** | **$5-20 USD/mes, total** |

**n8n 2.0 (enero 2026)** trajo integración nativa de LangChain, 70+ nodos IA, memoria persistente entre sesiones, y soporte de modelos locales con Ollama. No es "automatización con un paso de IA". Es **arquitectura de agente de verdad**.

---

### Capa 2 — El agente que habla (voz IA)

Investigado, precios reales de México (oct-2026):

| Plataforma | Modelo de cobro | Precio real | Nota |
|------------|-----------------|-------------|------|
| **Edesy** | por minuto | **desde $0.04 USD/min** | +52 mexicano, español natural. La más barata del mercado |
| Fonema AI | por minuto | $0.14 USD/min, facturado por segundo | 200+ voces de Latinoamérica, sin costo si no contestan |
| Retell AI | por minuto | $0.07–0.31 USD/min + modelo | Números solo de EUA/Canadá; +52 vía SIP |
| Vapi | por minuto | $0.05 USD plataforma + 4 proveedores | Tú armas el stack entero |
| **IAgente (Alex)** | plan cerrado | **$1,499 MXN/mes, 200 min** | Hecho en México, número +52, WhatsApp integrado, "te avisa cuando hay venta lista" |
| Voztro | consumo | $299 MXN + $4.50 MXN/min | Piso del mercado en México |
| Vokey | plan cerrado | $999–5,999 MXN/mes | Número de México incluido |
| NuTalk | plan fijo | desde $4,500 MXN/mes | Llamadas IA ilimitadas en tu línea, corre en México |

**El dato que decide:** Edesy a **$0.04 USD/min** son ~$0.70 MXN por minuto. Una llamada de calificación de 4 minutos = **$2.80 MXN**.

Si un agente de voz llama a 100 prospectos al mes y logras **3 reuniones**, tu costo es **$700 MXN**. Si una reunión se convierte en un sistema de $8,000, esa es la mejor inversión posible.

---

### Capa 3 — CRM / bandeja compartida (WhatsApp + IA)

| Plataforma | Precio | IA de verdad |
|------------|--------|-------------|
| **Wati** | $59 USD/mes anual | Chatbot no-code, inbox de equipo |
| **AiSensy** | desde $20 USD/mes | Flows + bot, orientado a broadcast |
| SleekFlow | $79 USD/mes | CRM dentro de la messaging UI |
| HelloSend | cotizar | Pipeline WhatsApp |
| ManyChat | desde $15 USD/mes | Visual, bueno para FAQ y capture |
| Respond.io | $79 USD/mes | Routing complejo |

**Para ti la respuesta es:** **no compres esto todavía.** Ya tienes DSW-OS. Si el embudo crece, integras tu CRM con WhatsApp via la API. Comprar un CRM antes de tener clientes es exactamente el error de los 60 documentos.

---

### Capa 4 — La que sí debes mirar ahora mismo (y es gratis)

**Wasender API** — conexión de WhatsApp por QR, sin infraestructura propia, con **nodo oficial de n8n**, API REST limpia con webhooks. Desde $6/mes.

⚠️ **Aviso honesto:** usa protocolos no oficiales. **Mismo riesgo de baneo que Evolution API.** Solo para pruebas, nunca con tu número principal de negocio. En producción: WhatsApp Business API oficial.

---

## 3. EL ARQUITECTURA QUE TE PROPONGO — "Motor DSW"

Un solo flujo en n8n que trabaja por ti mientras duermes. No es una lista de herramientas: es un diagrama.

```
┌─────────────────────────────────────────────────────────────┐
│                    MOTOR DSW  (n8n self-hosted)              │
│                                                             │
│  ⏰ 6:00 AM — ARRANQUE AUTOMÁTICO                            │
│     │                                                       │
│     ├─► Lee Supabase: prospectos con estado "Contactado"     │
│     │   y más de 3 días sin seguimiento                     │
│     │                                                       │
│     ├─► Agente IA escribe seguimiento personalizado           │
│     │   (usa el nombre, rubro y notas CADA prospecto)         │
│     │                                                       │
│     ├─► Envía por WhatsApp (ventana gratuita de 72h)         │
│     │                                                       │
│     ├─► Espera respuesta 24h                                 │
│     │   ├─ Respondió → notifica a Daniel, agenda en DSW-OS   │
│     │   ├─ No respondió → mensaje #3 de cierre → Sin respuesta│
│     │   └─ Dijo "lo pienso" → genera la regla de cierre       │
│     │                                                       │
│     └─► 11:00 PM — REPORTE AUTOMÁTICO                        │
│         Escribe a DSW-OS: contactos, respuestas, reuniones     │
└─────────────────────────────────────────────────────────────┘
```

**Lo que esto resuelve — y son tus 5 fugas de `ANATOMIA-FLUJO.md`:**

| Fuga | Cómo la resuelve el Motor DSW |
|------|-------------------------------|
| **1. Ghosts** | Solo toca prospectos con teléfono real. Nunca más "No registrado" |
| **2. Silencio** | El seguimiento del día 3 es **automático**. Ya no dependes de tu memoria |
| **3. Sin cierre** | Cuando alguien dice "lo pienso", el agente aplica la regla de cierre y agenda |
| **4. Sin cobrar** | Al llegar a entrega, genera el recordatorio de saldo al cliente |
| **5. Sin medir** | El reporte de las 11 PM llena los 6 números del viernes por ti |

**El beneficio, en tiempo:** 2 horas/día de venta manual → ~20 minutos de revisar lo que el motor encontró.

---

## 4. EL AGENTE DE VOZ — la pieza que falta

Tu pipeline tiene 21 prospectos con teléfono. **Los dentistas y barberías reciben llamadas. Nadie les llama.** Solo les escribes por WhatsApp.

Un agente de voz IA:
- Marca a prospectos que no respondieron WhatsApp en 7 días
- Dice: *"Hola, le llamo de parte de D.Softworks. Vi su clínica en Instagram. ¿Con quién hablo?"*
- Si es el dueño: *"¿Cuántos pacientes cancelan o no llegan a la semana?"*
- Si dice "muchos" → *"Nosotros resolvemos eso. ¿Le puedo agendar 10 minutos?"*

**Precio por acción:**

| Concepto | Costo |
|----------|-------|
| 100 llamadas/mes con Edesy | ~$700 MXN |
| 100 llamadas/mes con IAgente (plan) | $1,499 MXN |
| Si logras **1 reunión** de eso | Ya se pagaste 14 meses |

**⚠️ Advertencia real sobre llamadas en frío con voz IA:**
- Ojo: algunas plataformas (Bland) **prohíben** llamadas en frío con voz IA en sus términos.
- En México, respeta el **REPEP** (Registro Público para Evitar Pesquisas Publicitarias) — es la ley federal.
- Recomendación seria: **úsalo para llamadas entrantes** (cuando tu prospecto ya te agendó) y para **seguimiento a quien ya te respondió**, no para cold calls indiscriminados.

---

## 5. LO QUE NO DEBES COMPRAR (la lista que te ahorra dinero)

| Servicio | Precio | Por qué NO, todavía |
|----------|--------|---------------------|
| Wati / AiSensy / SleekFlow | $59–79 USD/mes | Ya tienes DSW-OS. No compres un CRM antes de tener clientes |
| Apollo / Clay / ZoomInfo | $49–167 USD/mes | Son bases de datos de empresas. Tú necesitas negocios locales en GDL — **Google Maps te sirve y es gratis** |
| Lindy / Regie.ai / Alta | $50–180 USD/mes | Construidos para SDRs de empresas grandes. Tú eres 2 personas vendiendo a dentistas |
| Synthflow | $30,000 USD/año | No, ni de cerca |
| Kubernetes / cualquier infra propia | — | Netlify ya resuelve todo lo tuyo |
| Paid ads | — | No tienes landing probada ni testimonials. Anunciar sin convertir es tirar dinero |

**Total gastado en herramientas en 2026: $0.** Ese es tu margen. No lo rompas pagando suscripciones que no has usado.

---

## 6. TABLA DE DECISIÓN — "¿Instalo esto?"

| Pregunta | Respuesta correcta |
|----------|--------------------|
| ¿Cierra una fuga de `ANATOMIA-FLUJO.md`? | Sí → instálalo |
| ¿Puedo pagarlo con lo que factura la próxima cotización? | Sí → instálalo |
| ¿Lo puedo desconectar sin romper nada? | Sí → instálalo |
| ¿Se ve bien en una demo? | Irrelevante → **no lo instales** |

---

## 7. EL PLAN DE 3 FASES

### 🟢 FASE 1 — Esta semana · $0 · 2 horas
**Objetivo: matar la Fuga 2 (el silencio) con lo que ya tienes.**

No necesitas instalar nada. Ya tienes:
- La lista de seguimientos (`prospecting/SEGUIMIENTOS-23SEP.md`)
- La app con los estados (`app/data/prospectos.json`)
- La regla de cierre en `04-Ventas/`

**Haz los 6 seguimientos a mano.** Sirven para dos cosas: cierras clientes, y te das los datos reales que el agente necesitará para calibrar.

> La IA se calibra con datos reales. Sin los 6 seguimientos hechos a mano, cualquier agente que instales va a estar adivinando.

---

### 🟡 FASE 2 — Mes 1 · ~$200 MXN/mes
**Objetivo: instalar el Motor DSW (n8n) para la Fuga 2 y la 3.**

| Paso | Qué | Costo |
|------|-----|-------|
| 1 | VPS para n8n (Hetzner/DigitalOcean) | $5-20 USD/mes |
| 2 | Instalar n8n Community Edition (Docker) | $0 |
| 3 | Conectar Supabase (ya tienes credenciales) | $0 |
| 4 | Flujo: leer Contactado >3 días → generar seguimiento con IA → enviar | $0 |
| 5 | Flujo: "lo pienso" → aplicar regla de cierre → agendar | $0 |
| 6 | Reporte 11 PM → escribir en DSW-OS | $0 |

**Lo que ya sabes y hace esto trivial:** Supabase, Netlify, JS, webhooks. **n8n es el mismo stack con nodos visuales. No hay nada nuevo que aprender.**

---

### 🔵 FASE 3 — Mes 2-3 · ~$700-1,500 MXN/mes
**Objetivo: agregar voz (Fuga 2 reinforcement) y cerrar el loop de cobro.**

| Paso | Herramienta | Costo |
|------|-------------|-------|
| 1 | Agente de voz para **llamadas entrantes** (cuando ya te agendaron) | $700 MXN/mes |
| 2 | Flujo: al entregar proyecto → recordatorio automático de saldo | $0 |
| 3 | Flujo: post-entrega → pedir reseña a las 48h | $0 |
| 4 | Flujo: cliente entregado a cliente entregado: ofertamos mantenimiento $300/mes | $0 |

**La fase 3 es donde aparece tu ingreso recurrente.** Cada cliente que pasa por el flujo 4 se convierte en $300/mes sin que vendas nada nuevo.

---

## 8. EL MODELO DE NEGOCIO QUE ESTO ABRE

Esto es lo que de verdad wanted. No "hacer más cosas". Esto:

```
HOY (servicios):
  $10,000/mes = 4 clientes × $2,500
  Cada cliente consume TU tiempo. El Motor DSW te devuelve ese tiempo.

MAÑANA (suscripción):
  $25,000/mes = 50 consultorios × $500/mes
  Mismo código. El motor se encarga. 0 horas extra.

CÓMO LLEGAS:
  Mes 1-2  → vendes servicios, cobras bien, usas el motor para vender más
  Mes 3-4  → 1er sistema de citas ($8,000). Aprendes todo
  Mes 5-6  → 2do cliente dental: 3 días en vez de 3 semanas ← AQUÍ ESTÁ EL MARGEN
  Mes 7+   → offering $500/mes multi-tenant. 50 clínicas, mismo código
```

**El orden importa más que la velocidad:**
- Nivel 2 antes que Nivel 1 = no tienes dónde aplicar lo nuevo
- Nivel 3 antes que 5 clientes = construyes un SaaS que nadie pidió

---

## 9. LA PRUEBA DE QUE FUNCIONA

30 días. Todas deben ser "sí":

- [ ] ¿El seguimiento del día 3 ocurre **sin que yo me acuerde**?
- [ ] ¿Ningún prospecto pasa más de 4 días sin un mensaje?
- [ ] ¿Cuando alguien dice "lo pienso", se agenda una reunión **automáticamente**?
- [ ] ¿El reporte de las 11 PM llenó los 6 números del viernes sin que yo los escriba?
- [ ] ¿Cobré mi primer saldo a tiempo?
- [ ] ¿Gasté menos de $500 MXN en herramientas este mes?

Si contestas "no" a 3 o más, el problema no es la tecnología. **Vuelve a `ANATOMIA-FLUJO.md` y cierra las 5 fugas a mano primero.**

---

## 10. RESUMEN

```
No necesitas una IA que piense por ti.
Necesitas una IA que haga lo aburrido a las 6 AM
mientras tú duermes, para que a las 9 AM
solo tengas que hablar con gente que ya dijo "sí".

Eso es todo lo que hace este motor.
Y eso vale más que cualquier lista de herramientas bonitas.
```

---

**Fuentes (investigadas 9-oct-2026):** tarifas oficiales Meta WhatsApp Business Platform México (1-oct-2026) · comparativas n8n/Make/Zapier 2026 · precios de agentes de voz IA en México (Edesy, Fonema, Retell, Vapi, Vokey, Voztro, Callbeat, IAgente, NuTalk) · WhatsApp automation platforms (Wati, AiSensy, ManyChat, SleekFlow, HelloSend).

**Documentos relacionados:** `01-Empresa/ANATOMIA-FLUJO.md` (las 5 fugas) · `01-Empresa/RUTA-TECNOLOGICA.md` (la escalera) · `LIDERAZGO-TECNOLOGICO.md` (el sistema de liderazgo) · `MODO-MILLONARIO.md` (las metas y el ritual)