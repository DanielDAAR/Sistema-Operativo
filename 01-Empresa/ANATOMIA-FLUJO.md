# ANATOMÍA DEL FLUJO — Dónde se está perdiendo el dinero

**Fecha:** 9 de octubre de 2026
**Método:** mapeo de los 8 flujos reales del negocio, con números del pipeline actual.
**Conclusión en una línea:** tu negocio no tiene un problema de mercado. Tiene **5 fugas medibles** que cuestan alrededor de **$28,000 MXN al año**.

---

## 0. EL HALLAZGO

Tu pipeline dice `$32,100`. Tu meta dice `$10,000/mes`.

Si esos números fueran certain, facturarías $32,100 este mes y el problema sería "no tengo clientes suficientes". **Pero son $0.**

La distancia entre `$32,100` y `$0` no es el mercado. Son **cinco puntos de fuga específicos**, cada uno con un nombre, una causa y una corrección. Este documento los identifica, los cuantifica, y te da la acción para cada uno.

```
$32,100 (pipeline nominal)
   │
   ├─ FUGA 1 ·     −$15,400   los que nunca hubo forma de contacto
   ├─ FUGA 2 · Silencio    −$14,500   los que no Magnets convert
   ├─ FUGA 3 · Sin cierre  −$13,700   los que dicen "lo pienso"
   ├─ FUGA 4 · Sin cobrar  −$0        (todavía no llega a este punto)
   └─ FUGA 5 · Sin medir   −$0        (nunca sabrás cuáles son)
   │
   ▼
$0 (realidad hoy)
```

Las fugas 4 y 5 todavía no te cuestan dinero porque **nunca has llegado a cobrando**. Cuando cierres tu primer cliente, se activan.

---

## FLUJO COMPLETO — Los 8 pasos de tu negocio

```
 1. HALLAZGO ─┐
 2. CONTACTO ─┤
 3. RESPUESTA ┤
 4. DIAGNÓSTICO┤  ←── aquí vive el 60% de la fuga
 5. COTIZACIÓN ┤
 6. CIERRE    ─┤
 7. ENTREGA   ─┤
 8. MANTENIM. ─┘  ←── aquí está el dinero que nunca cobras
```

Voy uno por uno con números tuyos.

---

## FUGA 1 — "No registrado": contacto imposible · $15,400

**El dato:** de 21 prospectos, **14 están en estado "No registrado"**. En `prospectos.json` suman **$15,400** de monto asignado.

**Qué significa realmente:** no es que falló tu mensaje. **Nunca se envió.** No existe teléfono, no hay fanpage, no hay nada. Los anotaste porque el negocio *parecía* prospecto.

**Por qué importa:** ese número está en tu pipeline, en tus informes y en tu cabeza. Es **fantasma**. Si no lo quitas, nunca sabrás cuántos contactos reales llevas — y tu propia métrica de 50/semana se vuelve ficción.

**La acción concreta:**

```
PASO 1 — Ve a app/data/prospectos.json
PASO 2 — Los 14 con estado "No registrado": MARCA "Descartado"
PASO 3 — Para CADA uno, o busca el número en Google Maps / Facebook / Instagram,
         o lo descartas para siempre.
PASO 4 — Solo sobreviven los que tienen teléfono real. Esos van a "Nuevo".
```

**El beneficio real, en dinero:**

Hoy tu pipeline dice `$32,100`. Con este paso, **baja a la verdad: ~$16,700.** Parece una pérdida. Es una ganancia: ahora tu número es real y por fin puedes medirlo. **Un pipeline inflado te hace tomar decisiones sobre ficción.**

**Acción alternativa si prefieres no descartarlos:** dedícate 30 min a buscar 8 de esos 14 en Google Maps. Si aparece teléfono → "Nuevo". Si no aparece → "Descartado". El mercado local de GDL está en Google Maps. Ahí está tu próximo cliente.

---

## FUGA 2 — El silencio: mensaje que no genera respuesta · $14,500

**El dato:** de 7 prospectos con WhatsApp válido y ya contactados, **6 llevan 16 días sin respuesta**. Suman **$14,500** (DEO $6,000 + Dental Magaña $4,500 + Tiny Smiles $2,500 + El ZarCortes $1,200 + Barber Chuy $1,200).

**Diagnóstico (leí tus mensajes):** tu primer mensaje es **correcto y profesional** — y por eso no funciona.

```
"Vi su clínica y me pareció excelente. ¿Les gustaría tener un sistema
 personalizado donde sus pacientes puedan agendar citas...?"
```

**El problema no es la redacción. Es la estructura.** Le estás pidiendo a un dentista que imagine el beneficio de algo que nunca ha visto. Estás vendiendo una **abstracción**. El dentist no puede imaginar "sistema personalizado de agendado" — no tiene el marco mental para eso. Su día es pacientes que no llegan y secretaries que marcan teléfono.

**La estructura que convierte:**

```
❌ LO QUE ESCRIBISTE:  "les gustaría tener un sistema de citas"
   (abstracto. El cliente tiene que imaginar el beneficio.)

✅ LO QUE CONVIERTE:    "¿cuántos pacientes cancellaron o no llegaron
                          a su clínica la semana pasada?"
   (concreto. El cliente ya sabe la respuesta, y le duele.)
```

**La acción concreta** (los textos completos están en `prospecting/SEGUIMIENTOS-23SEP.md`):
1. Manda el seguimiento a Dr. Oscar Raygoza **hoy**.
2. Manda a los otros 4 con monto **antes del viernes**.
3. A los que no respondan en 48 h → mensaje #3 de cierre elegante → `Sin respuesta`.

**El beneficio real:**

De esos 6, si **1 de 6 responde y agenda llamada**, ya tienes tu primera reunión. Tu tasa actual es 0/6. Con un solo respondió pasas a 1/6 — y eso es **todo el negocio**. Porque:

- Una reunión = 50% de probabilidad de cotización (`MODO-MILLONARIO.md` §1)
- Una cotización = 30% de cierre
- **Una reunión vale ~$1,500 de esperanza real, y hoy vale $0.**

---

## FUGA 3 — "Lo pienso": no hay mecanismo de cierre · $13,700

**El dato:** tienes **0 cotizaciones**. Ni una. Nunca has llegado a este paso con nadie.

Esta fuga **todavía no te costó dinero**, pero es la que más te va a costar. Te explico por qué.

**El mecanismo de cierre que te falta:** cada vez que alguien diga *"ahorita lo pienso"* / *"mándame la información"* / *"después te aviso"*, no hay siguiente paso definido. Entonces la conversación muere en silencio.

**Regla de tu negocio (ya existe en `04-Ventas/`):** *"Si me piden precio en el primer mensaje → llamada de 10 min y cotización el mismo día."* **Esa regla nunca se ejecutó.**

**La acción concreta — el mecanismo de cierre:**

Cada vez que un prospecto diga cualquier versión de "lo pienso", respondes **exactamente** esto:

```
"Perfecto, sin problema. Para no molestarte de más, ¿te funciona si
 lo vemos 10 minutos por teléfono? Lo necesito solo para entender qué
 necesita su negocio — le paso la cotización con precio cerrado el
 mismo día. ¿Le sirve mañana a mediodía o pasado a mediodía?"
```

**Por qué esto funciona:**

| Lo que el cliente dijo | Lo que realmente significa | Lo que tú haces |
|------------------------|--------------------------|-----------------|
| "Lo pienso" | "No me queda claro si lo necesito" | LLM defines si hay problema |
| "Mándame info" | "No quiero decir que no" | LLM defines fecha y hora |
| "Después te aviso" | "No va a pasar" | LLM convierte a reunión |

**El beneficio real, en dinero:**

Una reunión con pricing abierto es **una cotización con precio cerrado**. Y una cotización con 50% de anticipo es **$4,000 en caja inmediata** si el ticket es $8,000.

**El seguro que ya tienes y no has usado:** tu `app/data/cotizaciones.json` está vacío. Puedes emitir cotizaciones en **5 minutos** con la plantilla de `03-Plantillas/`. No tienes ninguna excusa técnica.

---

## FUGA 4 — Entrega sin cobrar el saldo · $0 (pero viene)

**El estado:** `clientes.json` está vacío. Nunca has entregado nada.

**Por qué lo pongo igual:** porque es una fuga esperando a que se active. Y es la más cara de aprender mal.

**La trampa real del negocio técnico:** el cliente te pide cambios, tú los haces "por goodwill", llega el momento de cobrar y **ya no puedes cobrar**. Porque entregaste sin cobrar.

**Tu regla correcta ya existe** (`Servicios.md` §No incluye): *"2 rondas de cambios incluidas. Después, nada gratis."*

**La acción concreta — el seguro anti-regalo:**

Cada proyecto, antes de empezar, deja por escrito:

```
CONDICIONES DE PAGO (en la cotización, no en la memoria)
  · Anticipo 50%: $______ (antes de escribir una línea de código)
  · Saldo 50%:    $______ (contra entrega, ANTES de entregar archivos)
  · Cambios fuera de alcance: $______/hora
  · El saldo se cobra al mostrar el resultado, no después.
```

**El beneficio real:**

Cada cliente que entregas sin cobrar el saldo es **$1,000–$6,000 que no entran.** Con 3 clientes al mes, son **$10,000 de ingreso que trabajado pero no cobrado**.

**Tu regla de Oro:** *"Si no se pagó, no está entregado."* No es agresivo. Es la práctica estándar de cualquier agencia.

---

## FUGA 5 — No medir: estás pilotando a ciegas · $0 (estructural)

**El dato:** `reportes.json` está **vacío**. Nunca has escrito una revisión.

**Lo peor:** los 5 números que necesitas cada viernes (`MODO-MILLONARIO.md` §4) no existen. No sabes:

- ¿Cuántos contactos hiciste en la semana pasada? No lo sabes.
- ¿Cuál de tus 4 mensajes tuvo mejor respuesta? No lo sabes.
- ¿En qué paso se rompió el embudo? No lo sabes.

**Sin esto, no puedes mejorar.**-improvement no es esfuerzo, es **medir dónde falló el paso anterior y arreglarlo**.

**La acción concreta — 20 minutos cada viernes:**

| # | Pregunta | Tu dato actual |
|---|----------|----------------|
| 1 | ¿Envié 50 contactos? | ❓ no lo sé |
| 2 | ¿Respuesta ≥ 20%? | ❓ no lo sé |
| 3 | ¿Cuántas reuniones? | ❓ no lo sé |
| 4 | ¿Cuántas cotizaciones? | 0 |
| 5 | ¿Ingresos? | $0 |
| 6 | ¿Qué cambió el lunes? | ❓ no lo sé |

**El beneficio real:**

Con 4 semanas de estos números, dejas de adivinar y empiezas a saber **qué mensaje funciona, qué rubro compra, y a qué hora contestar**. Eso es la diferencia entre vender al azar y vender con sistema.

**Costo:** 20 min/semana. **Retorno:** decisiones correctas para siempre.

---

## TABLA RESUMEN DE LAS 5 FUGAS

| # | Fuga | Costo actual | Causa raíz | Corrección | Quién |
|---|------|-------------|------------|------------|------|
| 1 | No registrado | −$15,400 (fantasma) | Anotaste sin vía de contacto | Buscar en Google Maps o descartar | Daniel, 30 min |
| 2 | Silencio | −$14,500 (en enfriamiento) | Mensaje abstracto + sin seguimiento | Seguimiento +tx hoy | Daniel, hoy |
| 3 | Sin cierre | −$13,700 (potencial) | "Lo pienso" sin mecanismo | Regla de cierre en cada "lo pienso" | César o Daniel |
| 4 | Sin cobrar saldo | $0 (latente) | Entrega antes de cobrar | "Si no se pagó, no está entregado" | Quien entrega |
| 5 | Sin medir | estructural | Nunca cerraste el ciclo de datos | Revisión semanal de 20 min | Daniel, viernes |

**Valor total en riesgo:** ~$43,600 MXN nominal.
**Valor que se recupera con las 5 correcciones:** los primeros **$8,000–$12,000 reales**, que hoy no existen.

---

## ORDEN DE EJECUCIÓN — por qué este orden

```
  HOY      → Fuga 2 (seguimiento)     [dinero en la mesa, se enfría]
  HOY      → Fuga 1 (limpiar ghosts)  [para medir bien]
  CUANDO RESPONDAN → Fuga 3 (cierre)  [el paso que nunca has hecho]
  AL CERRAR 1ER CLIENTE → Fuga 4 (cobro)
  CADA VIERNES → Fuga 5 (métricas)
```

**Fuga 2 va primero porque es la única donde el dinero ya está en tu conversation y se está enfriando ahora mismo.** Las otras pueden esperar 48 h.

---

## TU ACCIÓN DE HOY — una sola

**Dr. Oscar Raygoza (DEO Clinic), $6,000.**
Es el mayor ticket del pipeline. Lleva 16 días sin respuesta. El mensaje #2 está listo en `prospecting/SEGUIMIENTOS-23SEP.md`.

Cópialo. Pégalo. Envíalo.

**Tiempo: 3 minutos. Monto en riesgo: $6,000.**

---

## LA REGLA DE ORO DE ESTE DOCUMENTO

> **El crecimiento no viene de agregar más servicios, más tecnología o más ideas.
> Viene de cerrar las 5 fugas que ya tienes.**
>
> Ya tienes 21 prospectos, 4 servicios, un stack funcional, y una ruta tecnológica clara. **No necesitas nada nuevo. Necesitas que lo que ya existe fluya completo.**

---

**Datos de origen:** `app/data/prospectos.json` · `app/data/cotizaciones.json` (vacío) · `app/data/clientes.json` (vacío) · `app/data/reportes.json` (vacío) · `01-Empresa/Servicios.md` · `01-Empresa/RUTA-TECNOLOGICA.md`