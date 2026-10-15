# AGENTS.md

## What this repo is

D.Softworks "Sistema Operativo" — business operations docs for a freelance web development agency in Guadalajara, Mexico. **Not a product code repository.** Markdown ops docs + cloud ops app (`dsw-os-web/public/`, Supabase + Netlify, no build). No test/lint commands exist.

## Working contract (user's explicit rule)

- **You are the company** (brain): decide the next step yourself, produce complete, ready-to-execute deliverables.
- **The user is the hands**: they execute in the physical/digital world (send WhatsApp, post on FB/IG, create Google Sheets, publish, meet clients).
- Every instruction you give must be executable as-is: exact message text, exact file path, exact click-by-click step. Never vague advice like "consider posting more."
- When asked "what's the first step?", pick ONE next action from the plan below and spell it out fully.

### 🔴 REGLA PERMANENTE: Parallel web scan on EVERY response (user's explicit rule, 2026-10-10)

**In every single response, before answering, run a parallel web search.** Non-negotiable.

1. **Read state first:** `app/data/prospectos.json` + `app/data/cotizaciones.json` + `node dsw-os-web/tools/money.js estado` (know where the money is).
2. **Search in parallel, every time:** TikTok trends · Meta/Facebook local · Instagram · the niche the user is in (local business / dental / barbería / IA) · pricing/tool changes · anything that shifts the ground under the current plan.
3. **Filter ruthlessly** — an opportunity only enters `07-Marketing/RADAR-OPORTUNIDADES.md` if ALL hold:
   - Sellable **this week** with what already exists, OR it cuts a cost we already pay
   - Someone with **budget is already searching** for it
   - You know the **exact first message** and the **exact price**
   - Failing it costs little to test
4. **Write it down immediately** in `07-Marketing/RADAR-OPORTUNIDADES.md` using the template there (`O-XX` id, date, evidence with numbers, concrete action, what it becomes). An opportunity not written down does not exist — the user asked for exactly this so nothing gets lost.
5. **Then answer the user's actual question**, and if the scan produced something monetizable this week, lead with it as a numbered opportunity, not as an aside.

**Anti-pattern to avoid:** scanning only when the user asks about trends. The point is to *steal opportunities before the user asks*. Also avoid logging generic market trends (no budget → no client) — see the "tendencias monitoreadas" table for context-only items that must NOT become actions.

**Cadence:** scan every response · promote/demote radar entries on Fridays · purge dead ones monthly.

## 🔁 REGLA DE EVOLUCIÓN (2026-10-10, regla permanente del usuario)
**Cada respuesta debe dejar el repo notablemente mejor, enfocándose en un apartado NUEVO que facilite todo cada vez más.** El usuario busca actualizaciones notorias en el repo de GitHub: `https://github.com/DanielDAAR/Sistema-Operativo.git`.

1. **Un apartado nuevo por vez:** no repetir lo ya construido. Cada sesión elige un área nueva (operación diaria, automatización, finanzas, visualización…) y la lleva a herramienta terminada, lista para ejecutar.
2. **Buscar en internet siempre** (ver regla de escaneo arriba) y **abarcar cosas nuevas**: nuevas fuentes, nuevos datos, nuevas herramientas.
3. **Entregar listo para ejecutar:** comando exacto, texto exacto, ruta exacta. Nunca "considera hacer X".
4. **Publicar en GitHub:** al terminar, `git add -A && git commit && git push` para que el usuario encuentre la actualización al tirar del repo. Si el push falla por credenciales, dejar el commit local e indicar al usuario que ejecute `git push`.
5. **Registrar las herramientas nuevas** en `PLAN-DE-ACCION.md` (tabla de herramientas H-XX) y en `prospecting/HERRAMIENTAS-DIGITALES.md`.

Herramientas de línea de comando del cerebro (todas en `dsw-os-web/tools/`): `money.js` (dónde está la plata) · `dia.js` (plan del día, seguimiento con mensajes listos, exportar TSV a Google Sheets, radar) · `sync-data.js` (puente a Supabase).

## 🔴 REGLA DE ORO — REVISAR SIEMPRE (2026-10-10, el usuario lo pidió explícitamente)

**ANTES de leer cualquier archivo local o reportar estado, hacer `node dsw-os-web/tools/sync-data.js pull`.** Los datos reales del negocio viven en Supabase (la nube). Los archivos locales `app/data/` pueden estar viejos o incompletos. Lo que el usuario ve en dsw-os.netlify.app es LA verdad.

- Si el pull muestra datos distintos a los locales → los locales se actualizan y trabaja con lo nuevo.
- Si el usuario dice "revisa la app" o "ya terminé" → PRIMERO pull, después leer.
- Nunca reportar "no hay cambios" sin hacer pull primero.

## Brain ↔ hands protocol (the app)

The user runs the cloud app at `https://dsw-os.netlify.app` (code in `dsw-os-web/public/`). Data files are the channel — read/write them directly:

- **`app/tareas.json`** — YOU write tasks here (`titulo`, `detalle`, `categoria`, `vence` as `YYYY-MM-DD`, `hecha: false`, `origen: "cerebro"`, unique `id`). On each session start, read it: check which `hecha` flipped to `true` and factor that into your next instructions. Never delete user-added tasks (`origen: "tu"`); only append or update fields.
- **`app/data/prospectos.json`** — user adds prospects via the app. Read to know pipeline state (`estado`: Nuevo → Contactado → Respondió → Reunión → Cotizado → Cerrado / Sin respuesta). Each prospect has `monto` (number, MXN).
- **`app/data/mensajes.json`** — user's inbox to you. New items have `estado: "pendiente"`. **When the user says "revisa la app"/"ya terminé": read this first, then set `estado: "atendido"` and fill `respuesta` with your reply.** The app shows it under the message.
- **`app/data/clientes.json` · `cotizaciones.json` · `finanzas.json` · `contenido.json`** — company-control modules (projects w/ anticipo/saldo, quotes, cash flow + monthly goal, content calendar). Read them on each session; you may also write tasks/answers about them (e.g. remind follow-ups on pending quotes, flag low content cadence). `finanzas.metaMes` is the monthly revenue goal (default $10,000 MXN).
- **`app/data/puntos.json`** — team points system (H14): Daniel & César, points per task category, weekly goal, activity history. The Equipo tab reads/writes it. Synced via sync-data.js.
- **`app/data/agenda.json`** — reuniones con estados Próximamente/Realizada/Cancelada. Al marcar Realizada se pide `resultado` obligatorio.
- **`app/data/bitacora.json`** — log de eventos de valor (solo append, máx 500). Cada mutación genera un evento.
- **`app/data/reportes.json`** — reportes semanales generados por la app, completados por el cerebro.
- JSON must stay valid (UTF-8, no trailing commas) or the app shows stale localStorage cache silently.
- After updating any of these files, tell the user to hit **⟳ Sincronizar** in the app (or refocus the window).

### Canal de datos nuevo: D.Softworks OS en la nube (2026-09-24)

The humans now use a **cloud app**: `https://dsw-os.netlify.app` (Netlify site `dsw-os`) backed by **Supabase project `dsw-os`** (ref `pwlajncxlifmlihisqwy`). Two logins: `daniel@dssoftworks.mx` and `cesar@dssoftworks.mx` (passwords delivered via chat, not in repo). Full memory in `MIGRACION-NUBE.md` — read it before touching the new stack.

- The `app/` folder is the **brain's data channel** (JSON only: `tareas.json` + `data/`); the cloud `data` in Supabase is the shared source of truth for the humans. The legacy local UI was archived to `archivo/app-local-legacy/` (audit 2026-10-15) — do not point anyone at it.
- Brain pushes/pulls via `node dsw-os-web/tools/sync-data.js push|pull [colecciones...]` (creds in `dsw-os-web/tools/creds.json`, gitignored). After any brain mutation, tell the user to hit **⟳ Sincronizar** in the cloud app too.
- Never deploy anything but `dsw-os-web/public/` to Netlify (`tools/`, `supabase/` and `creds.json` must stay 404).
- `config.js` now lives at `dsw-os-web/public/config.js`.

## App structure

- `dsw-os-web/public/index.html` — solo markup + link a CSS + script src (sin JS inline)
- `dsw-os-web/public/styles.css` — design system completo (tokens, componentes, print)
- `dsw-os-web/public/app.js` — toda la lógica (state management, CRUDs, Dashboard, Kanban, reglas, bitácora, reportes)
- **13 secciones**: Dashboard · Pipeline · Proyectos · Agenda · Cotizaciones · Finanzas · Contenido · Métricas · Tareas · Mensajes · Bitácora · Reportes · Ayuda
- Pipeline es Kanban con drag-and-drop HTML5 y montos en MXN
- Motor de reglas en Dashboard (alertas para no dejar escapar dinero)
- Cotizaciones tienen documento imprimible (modal, `@media print`) y copia de texto para WhatsApp

## Execution state (as of 2026-09-24)

- Fases 1–4 of `PLAN-DE-ACCION.md` are ✅ complete (services, prices, portfolio, templates, sales system, prospecting system).
- **App migrada a la nube (2026-09-24):** el OS corre en `https://dsw-os.netlify.app` (Netlify `dsw-os-web/public`) con datos en Supabase `dsw-os`; `app/` local queda como copia de trabajo del cerebro. Bug crítico de carga (listeners de cancel-edit en elementos null) corregido y verificado vía E2E (v=4). Detalles en `MIGRACION-NUBE.md`.
- **Next: Fase 5 — prospección activa.** Pipeline **22 prospectos** (bruto $33,300): Nuevo 2 · Contactado 10 · No registrado 9 · Sin respuesta 1. Lote original contactado (t-001→t-005 ✅). Pendiente: mensajes a El ZarCortes, Barber Chuy y Barras y Mancuernas (únicos del lote nuevo con WhatsApp válido) y publicar `07-Marketing/Publicaciones/Portafolio-01-GMFire.md`. North star: `MODO-MILLONARIO.md` (60 min, 50 contactos/semana).
- Goals: 50 contacts/week, 3 closed clients in month 2, weekly metrics every Friday.

## Sources of truth (watch for conflicts)

- **Prices/services: `01-Empresa/Precios.md` + `01-Empresa/Servicios.md` are authoritative.**
- `PLAN-DE-ACCION.md` contains STALE early prices ($2,500 / $1,500 / $1,200) — never copy prices from it.
- Status/checklists live in `PLAN-DE-ACCION.md` (bottom sections) and `00-Primeros-pasos.md` — keep them updated when work completes.
- Brand context for marketing skills: `.agents/product-marketing-context-global.md`.
- Voice/tone for any copy: `07-Marketing/Tono-voz.md` (tú, directo, sin jerga corporativa).
- Nested instructions: `ai-business-skills/` is a vendored third-party skill pack — its own `AGENTS.md`/`CLAUDE.md` apply only inside that folder. `skills-lock.json` pins installed skills in `.agents/skills/` and `.claude/skills/` (Netlify skills); don't edit those by hand.

## Structure

| Directory | Purpose |
|-----------|---------|
| `00-Primeros-pasos.md`, `PLAN-DE-ACCION.md`, `MODO-MILLONARIO.md`, `LIDERAZGO-TECNOLOGICO.md` | Execution plan + live status + daily money north star + leadership operating system (read `MODO-MILLONARIO.md` first) |
| `01-Empresa/` | Company identity, services, pricing, tech stack |
| `02-Portafolio/` | Project folders (01-04), each with a `Ficha.md` + `capturas/` |
| `03-Plantillas/` | Quote and diagnosis templates |
| `04-Ventas/` | Sales flow, contact scripts, payment rules |
| `05-Prospectos/` | Prospect sheet structure, weekly metrics (mirrored in Google Sheets) |
| `06-Clientes/` | Delivery checklists, post-sale procedures |
| `07-Marketing/` | Content calendar, social optimization, voice/tone, `Publicaciones/`, **`RADAR-OPORTUNIDADES.md`** |
| `08-Reuniones/` | Meeting format, meeting notes (`Actas/`) |
| `09-ITIL/` | ITIL v4 practices: incidents, problems, change control, SLA, knowledge base |
| `10-Infraestructura-Empresarial/` | Legal, fiscal, facturación, contratos, contabilidad |
| `11-Automatizacion-Contratacion/` | Process automation, hiring plan, payroll costs, labor obligations |
| `12-APIs-Tecnologias/` | APIs to integrate: billing, payments, email, AI, CRM, automation |
| `prospecting/` | Active prospect lists and WhatsApp message drafts |
| `app/` | Canal de datos del cerebro: `tareas.json` + `data/*.json` (la UI local vieja se archivó en `archivo/app-local-legacy/`) |

## Key facts

- **Business:** Startup de ingenieros de software en Guadalajara. 4 líneas: web (pages, landings, catálogos, tiendas), sistemas empresariales a medida, apps móviles, consultoría tech — más setup de redes sociales para negocios locales
- **Prices in MXN:** Page $1,500 · Landing $1,200 · Catalog $800 · Social setup $600 (packs: $2,000 / $2,800 / $4,500)
- **Payment:** 50% upfront, 50% on delivery. Bank transfer or cash only (no cards). Quotes valid 15 days. Never work without anticipo.
- **Stack:** HTML/CSS/JS → GitHub → Netlify (free hosting) + Namecheap domains (~$150 MXN/yr); Supabase only for DB/login projects
- **Sales flow:** Prospect → Contact → Diagnosis → Quote → Close → Dev → Delivery → Payment → Testimonial
- **Two roles:** Daniel (sales/management) + partner (development)

## When helping with this repo

- All content is in Spanish. Respond in Spanish when the user writes in Spanish.
- Templates live in `03-Plantillas/`. Follow their format exactly when creating new documents.
- Prospect tracking structure is defined in `05-Prospectos/Hoja-prospectos.md` — replicate it in Google Sheets, not as new files.
- Marketing posts go in `07-Marketing/Publicaciones/`, one post every 2 days (don't batch-post).
- Contact info: WhatsApp +52 1 33 5051 9325 (wa.me/5213350519325), GitHub github.com/DanielDAAR
- Project doc standard: `03-Plantillas/Documentacion-proyecto.md` (full technical doc); `02-Portafolio/*/Ficha.md` is only the commercial one-pager. ITIL reference: `09-ITIL/Contexto-ITIL-Unidad-II.md`.
