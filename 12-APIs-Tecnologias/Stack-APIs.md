# D.Softworks — APIs y Tecnologías para Integrar

**Fecha de creación:** 22 de septiembre de 2026
**Objetivo:** APIs y servicios para automatizar, escalar y profesionalizar D.Softworks

---

## RESUMEN RÁPIDO

### APIs que DEBES integrar YA ( Gratis )

| API | Para qué | Costo |
|-----|----------|-------|
| **Supabase** | Base de datos, auth, almacenamiento | Gratis (500MB) |
| **Netlify** | Hosting + deploy automático | Gratis |
| **GitHub** | Control de versiones | Gratis |
| **Brevo** | Email transaccional + marketing | Gratis (300 emails/día) |
| **Make.com** | Automatización entre apps | Gratis (1000 ops/mes) |
| **FacturAPI** | Facturación electrónica CFDI | ~$5/factura |
| **WhatsApp Business** | Atención al cliente | Gratis |

### APIs que necesitarás CUANDO ESCALES

| API | Para qué | Costo |
|-----|----------|-------|
| **Stripe** | Cobros con tarjeta | 2.9% + $0.30 por transacción |
| **PayPal** | Pagos internacionales | 3.49% + $0.55 por transacción |
| **Mercado Pago** | Pagos en México | 3.49% + $4.99 por transacción |
| **Twilio** | SMS y llamadas | ~$0.01 por SMS |
| **SendGrid** | Email masivo | Gratis (100 emails/día) |
| **Resend** | Email transaccional | Gratis (100 emails/día) |
| **Vercel** | Hosting alternativo | Gratis |
| **Cloudflare** | CDN + DNS + Seguridad | Gratis |

---

## PARTE 1: APIs PARA TU NEGOCIO (Operación Interna)

### 1. Facturación Electrónica — FacturAPI

**Qué hace:** Emitir facturas electrónicas (CFDI 4.0) ante el SAT

**Por qué la necesitas:**
- Obligación fiscal
- Los clientes grandes te pedirán factura
- Professionalismo

**Cómo integrarla:**

```javascript
// Ejemplo: Crear factura con FacturAPI
const facturapi = require('facturapi');

const client = new facturapi.Client('TU_API_KEY');

// Crear cliente
const customer = await client.customer.create({
  legal_name: 'Nombre del Cliente',
  tax_id: 'ABC850101XX1',
  tax_system: '612',
  email: 'cliente@email.com',
  address: {
    zip: '44100',
    country: 'MEX'
  }
});

// Crear factura
const invoice = await client.invoice.create({
  customer: customer.id,
  items: [{
    quantity: 1,
    product: {
      description: 'Servicio de desarrollo web - Página web',
      product_key: '81112100',
      price: 1500,
      tax_included: true
    }
  }]
});
```

**Costo:** ~$5 por factura
**Registro:** https://facturapi.io

---

### 2. Email Transaccional — Resend o Brevo

**Qué hace:** Enviar emails automáticos (confirmaciones, recibos, seguimientos)

**Por qué lo necesitas:**
- Emails de confirmación de pago
- Seguimiento post-venta
- Marketing por email

**Resend (recomendado para desarrollo):**

```javascript
// Ejemplo: Enviar email de confirmación con Resend
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxxxxxxxxx');

await resend.emails.send({
  from: 'D.Softworks <notificaciones@dsoftworks.com>',
  to: 'cliente@email.com',
  subject: 'Pago recibido - Gracias',
  html: `
    <h1>¡Gracias por tu pago!</h1>
    <p>Hemos recibido tu pago de $1,500 MXN.</p>
    <p>Tu factura electrónica está adjunta.</p>
    <p>D.Softworks — Soluciones Digitales</p>
  `
});
```

**Costo:** Gratis hasta 100 emails/día
**Registro:** https://resend.com

**Alternativa: Brevo (más fácil):**
- Interfaz visual
- Templates arrastrar y soltar
- Gratis hasta 300 emails/día
- Registro: https://brevo.com

---

### 3. CRM — HubSpot o Google Sheets

**Qué hace:** Gestionar clientes, prospectos y pipeline de ventas

**Opción A: Google Sheets (Gratis, ya lo tienes)**

```javascript
// Ejemplo: Guardar lead en Google Sheets con Make.com
// Configurar en make.com:
// Trigger: Nuevo mensaje en Facebook/Instagram
// Action: Agregar fila en Google Sheets
```

**Opción B: HubSpot CRM (Gratis hasta 1,000,000 de contactos)**

```javascript
// Ejemplo: Crear contacto en HubSpot
const hubspot = require('@hubspot/api-client');

const client = new hubspot.Client({
  accessToken: 'TU_ACCESS_TOKEN'
});

await client.crm.contacts.basicApi.create({
  properties: {
    email: 'cliente@email.com',
    firstname: 'Juan',
    lastname: 'Pérez',
    phone: '+52 33 1234 5678',
    company: 'Negocio del Cliente',
    lifecyclestage: 'lead'
  }
});
```

**Costo:** Gratis hasta 1,000,000 de contactos
**Registro:** https://hubspot.com

---

### 4. Gestión de Proyectos — Notion o Trello

**Qué hace:** Organizar proyectos activos, tareas y deadlines

**Notion API (recomendado):**

```javascript
// Ejemplo: Crear tarea en Notion
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: 'TU_API_KEY' });

await notion.pages.create({
  parent: { database_id: 'TU_DATABASE_ID' },
  properties: {
    'Nombre': {
      title: [{ text: { content: 'Página web - Barbería XYZ' } }]
    },
    'Estado': {
      select: { name: 'En progreso' }
    },
    'Fecha límite': {
      date: { start: '2026-09-30' }
    },
    'Cliente': {
      rich_text: [{ text: { content: 'Juan Pérez' } }]
    }
  }
});
```

**Costo:** Gratis para uso básico
**Registro:** https://notion.so

---

### 5. Comunicación — WhatsApp Business API

**Qué hace:** Enviar mensajes automátivos, respuestas rápidas, catálogo

**No necesitas API cara — con la app gratis basta:**

| Característica | Gratis | API de pago |
|----------------|--------|-------------|
| Mensajes ilimitados | ✅ | ✅ |
| Respuestas rápidas | ✅ | ✅ |
| Catálogo de productos | ✅ | ✅ |
| Etiquetas de clientes | ✅ | ✅ |
| Messages API (automático) | ❌ | ✅ ($0.01/mensaje) |

**Recomendación:** Empezar con la app gratis, usar API cuando necesites automatización completa.

---

## PARTE 2: APIs PARA TUS CLIENTES (Servicios que puedes ofrecer)

### 6. Pagos en Línea — Stripe

**Qué hace:** Cobrar con tarjeta de crédito/débito en los sitios de tus clientes

**Por qué lo necesitas:**
- Ofrecer tiendas en línea
- Cobrar suscripciones
- Clientes que quieren pagos con tarjeta

**Cómo integrarlo en un sitio de cliente:**

```javascript
// Ejemplo: Checkout con Stripe
const stripe = require('stripe')('sk_test_xxxxx');

// Crear sesión de checkout
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'mxn',
      product_data: {
        name: 'Servicio de Barbería',
        description: 'Corte de cabello + barba'
      },
      unit_amount: 35000 // $350 MXN en centavos
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://tunegocio.com/exito',
  cancel_url: 'https://tunegocio.com/carrito'
});
```

**Costo:** 2.9% + $0.30 MXN por transacción
**Registro:** https://stripe.com

---

### 7. Pagos México — Mercado Pago

**Qué hace:** Cobrar con tarjeta, OXXO, Mercado Crédito en México

**Ventaja:** Los mexicanos confían más en Mercado Pago

```javascript
// Ejemplo: Pago con Mercado Pago
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'TU_ACCESS_TOKEN'
});

const payment_data = {
  transaction_amount: 1500,
  description: 'Página web - Negocio XYZ',
  payment_method_id: 'visa',
  token: 'tok_xxxxx',
  installments: 3,
  payer: {
    email: 'cliente@email.com'
  }
};

mercadopago.payment.create(payment_data)
  .then(response => console.log(response.body))
  .catch(error => console.log(error));
```

**Costo:** 3.49% + $4.99 MXN por transacción
**Registro:** https://mercadopago.com.mx

---

### 8. Almacenamiento de Archivos — Supabase Storage

**Qué hace:** Guardar imágenes, PDFs y archivos de clientes

```javascript
// Ejemplo: Subir imagen de cliente
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('URL', 'KEY');

// Subir archivo
const { data, error } = await supabase.storage
  .from('clientes')
  .upload('barberia-xzy/logo.png', file);

// Obtener URL pública
const { data: urlData } = supabase.storage
  .from('clientes')
  .getPublicUrl('barberia-xzy/logo.png');
```

**Costo:** Gratis hasta 1GB de almacenamiento
**Registro:** https://supabase.com

---

### 9. Autenticación — Supabase Auth

**Qué hace:** Login de usuarios para portales de clientes

```javascript
// Ejemplo: Login con Supabase
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('URL', 'KEY');

// Login con email
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'contraseña123'
});

// Login con Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

**Costo:** Gratis hasta 50,000 usuarios activos mensuales
**Registro:** https://supabase.com

---

### 10. Inteligencia Artificial — OpenAI / Claude

**Qué hace:** Agregar IA a los proyectos de tus clientes

**Casos de uso:**
- Chatbots para atención al cliente
- Generación de contenido
- Análisis de datos
- Asistentes virtuales

```javascript
// Ejemplo: Chatbot con OpenAI
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'TU_API_KEY'
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Eres el asistente virtual de la barbería XYZ.' },
    { role: 'user', content: '¿Cuánto cuesta un corte de cabello?' }
  ]
});
```

**Costo:** ~$0.002 por 1,000 tokens (gpt-4o-mini)
**Registro:** https://platform.openai.com

---

### 11. Maps y Geolocalización — Google Maps

**Qué hace:** Mostrar ubicación de negocios en mapas

```javascript
// Ejemplo: Mapa interactivo con Google Maps
// HTML:
<div id="map" style="height: 400px;"></div>

<script>
function initMap() {
  const ubicacion = { lat: 20.659698, lng: -103.349609 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: ubicacion
  });
  new google.maps.Marker({
    position: ubicacion,
    map: map,
    title: "Barbería XYZ"
  });
}
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap"></script>
```

**Costo:** Gratis hasta 28,500 mapas/mes
**Registro:** https://console.cloud.google.com

---

### 12. Email Marketing — Mailchimp

**Qué hace:** Campañas de email marketing, newsletters

```javascript
// Ejemplo: Agregar suscriptor con Mailchimp
const mailchimp = require('@mailchimp/mailchimp_transactional')('TU_API_KEY');

await mailchimp.messages.send({
  message: {
    from: { email: 'newsletter@dsoftworks.com', name: 'D.Softworks' },
    subject: 'Nuevas tendencias en diseño web 2026',
    text: 'Descubre las tendencias...',
    to: [{ email: 'cliente@email.com', type: 'to' }]
  }
});
```

**Costo:** Gratis hasta 500 contactos
**Registro:** https://mailchimp.com

---

## PARTE 3: STACK COMPLETO RECOMENDADO

### Para D.Softworks (Operación Interna)

```
┌─────────────────────────────────────────────────┐
│                D.SOFTWORKS STACK                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  VENTAS & CRM                                    │
│  ├── Google Sheets (CRM básico)                  │
│  ├── HubSpot (CRM profesional, gratis)           │
│  └── Trello (Gestión de proyectos)               │
│                                                  │
│  DESARROLLO                                      │
│  ├── GitHub (Código fuente)                      │
│  ├── VS Code (Editor)                            │
│  └── Netlify (Hosting + Deploy)                  │
│                                                  │
│  BASE DE DATOS                                   │
│  └── Supabase (PostgreSQL + Auth + Storage)      │
│                                                  │
│  COMUNICACIÓN                                    │
│  ├── WhatsApp Business (Clientes)                │
│  ├── Brevo (Email transaccional)                 │
│  └── Make.com (Automatización)                   │
│                                                  │
│  FINANZAS                                        │
│  ├── FacturAPI (Facturación CFDI)                │
│  └── Google Sheets (Contabilidad)                │
│                                                  │
│  DISEÑO                                          │
│  ├── Canva (Imágenes)                            │
│  └── Figma (UI/UX)                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Para Proyectos de Clientes

```
┌─────────────────────────────────────────────────┐
│           STACK PARA CLIENTES                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  PÁGINA WEB BÁSICA ($1,500 MXN)                 │
│  ├── HTML/CSS/JS                                 │
│  ├── GitHub                                      │
│  ├── Netlify (hosting)                           │
│  └── Namecheap (dominio)                         │
│                                                  │
│  LANDING PAGE ($1,200 MXN)                       │
│  ├── HTML/CSS/JS                                 │
│  ├── Netlify Forms                               │
│  └── Google Analytics                            │
│                                                  │
│  TIENDA EN LÍNEA ($3,500+ MXN)                  │
│  ├── HTML/CSS/JS                                 │
│  ├── Supabase (catálogo + auth)                  │
│  ├── Stripe o Mercado Pago (pagos)               │
│  └── Netlify + Supabase                          │
│                                                  │
│  SISTEMA DE RESERVACIÓN ($4,000+ MXN)            │
│  ├── HTML/CSS/JS                                 │
│  ├── Supabase (base de datos)                    │
│  ├── Supabase Auth (login)                       │
│  └── Google Maps API (ubicación)                 │
│                                                  │
│  CHATBOT CON IA ($5,000+ MXN)                    │
│  ├── HTML/CSS/JS                                 │
│  ├── OpenAI API (IA)                             │
│  └── Supabase (historial)                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## PARTE 4: CÓMO INTEGRAR ESTAS APIs

### Paso 1: Obtener API Keys

| Servicio | Cómo obtener la key |
|----------|---------------------|
| Supabase | Dashboard → Settings → API |
| FacturAPI | facturapi.io → Dashboard → API Keys |
| Resend | resend.com → API Keys |
| Stripe | dashboard.stripe.com → Developers → API Keys |
| Mercado Pago | mercadopago.com.mx → Tu cuenta → Credenciales |
| OpenAI | platform.openai.com → API Keys |
| Google Maps | console.cloud.google.com → Credentials |

### Paso 2: Guardar API Keys de Forma Segura

**NUNCA guardes API keys en el código. Usa variables de entorno:**

```javascript
// Archivo .env (NUNCA subir a GitHub)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
STRIPE_KEY=sk_test_xxxxx
FACTURAPI_KEY=sk_live_xxxxx

// En tu código:
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
```

**Agregar a .gitignore:**
```
.env
.env.local
.env.production
```

### Paso 3: Instalar dependencias

```bash
# Supabase
npm install @supabase/supabase-js

# Stripe
npm install stripe

# Mercado Pago
npm install mercadopago

# FacturAPI
npm install facturapi

# Resend (email)
npm install resend

# OpenAI
npm install openai

# HubSpot
npm install @hubspot/api-client

# Notion
npm install @notionhq/client
```

---

## PARTE 5: FLUJOS AUTOMATIZADOS CON APIS

### Flujo 1: Cliente paga → Factura se genera automáticamente

```
[Cliente paga por transferencia]
    ↓
[Daniel confirma pago en Google Sheets]
    ↓
[Make.com detecta cambio]
    ↓
[Llama a FacturAPI para crear factura]
    ↓
[Envía factura por email con Resend]
    ↓
[Mensaje WhatsApp: "Pago y factura listos"]
```

### Flujo 2: Nuevo lead → Se registra automáticamente

```
[Mensaje en Facebook/Instagram]
    ↓
[Make.com detecta mensaje]
    ↓
[Guarda en Google Sheets + HubSpot]
    ↓
[Envía email de bienvenida con Brevo]
    ↓
[WhatsApp: "Gracias por contactarnos"]
```

### Flujo 3: Proyecto terminado → Seguimiento automático

```
[Daniel marca "entregado" en Trello]
    ↓
[Make.com detecta cambio de estado]
    ↓
[Día 7: Resend envía email de seguimiento]
    ↓
[Día 30: Resend envía email de oportunidad]
    ↓
[Día 60: Resend envía email de mantenimiento]
```

---

## COSTOS TOTALES DE APIs

### Para D.Softworks (Operación)

| API | Uso mensual estimado | Costo |
|-----|----------------------|-------|
| Supabase | Básico | $0 |
| Netlify | Hosting | $0 |
| GitHub | Código | $0 |
| Brevo | 300 emails/día | $0 |
| Make.com | 1000 ops/mes | $0 |
| FacturAPI | 10 facturas | ~$50 MXN |
| **TOTAL** | | **~$50 MXN/mes** |

### Para Proyectos de Clientes (ejemplo tienda en línea)

| API | Uso | Costo |
|-----|-----|-------|
| Supabase | Base de datos | $0 |
| Netlify | Hosting | $0 |
| Stripe | 20 transacciones/mes | ~$700 MXN (2.9%) |
| Google Maps | Mapa | $0 |
| **TOTAL** | | **~$700 MXN** (lo cobra al cliente) |

---

## CHECKLIST DE IMPLEMENTACIÓN

### Semana 1 — APIs Básicas
- [ ] Obtener API key de Supabase
- [ ] Obtener API key de FacturAPI
- [ ] Crear cuenta en Resend
- [ ] Crear cuenta en Make.com
- [ ] Configurar variables de entorno

### Semana 2 — Integración
- [ ] Probar FacturAPI (generar factura de prueba)
- [ ] Configurar email de confirmación con Resend
- [ ] Crear primer flujo de automatización en Make.com
- [ ] Conectar Google Sheets con Make.com

### Semana 3 — Para Clientes
- [ ] Obtener API key de Stripe
- [ ] Obtener API key de Mercado Pago
- [ ] Obtener API key de Google Maps
- [ ] Crear template de tienda en línea

### Semana 4 — Optimización
- [ ] Documentar todos los flujos
- [ ] Crear guía de uso para cada API
- [ ] Monitorear costos
- [ ] Ajustar lo que no funcione

---

**D.Softworks — Soluciones Digitales**
**Documento creado:** 22 de septiembre de 2026
**Versión:** 1.0