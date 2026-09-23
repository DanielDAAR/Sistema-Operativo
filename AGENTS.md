# AGENTS.md

## What this repo is

D.Softworks "Sistema Operativo" — business operations docs for a freelance web development agency in Guadalajara, Mexico. **Not a product code repository.** Markdown ops docs + one single-file local app (`app/index.html`, no build). No test/lint commands exist.

## Working contract (user's explicit rule)

- **You are the company** (brain): decide the next step yourself, produce complete, ready-to-execute deliverables.
- **The user is the hands**: they execute in the physical/digital world (send WhatsApp, post on FB/IG, create Google Sheets, publish, meet clients).
- Every instruction you give must be executable as-is: exact message text, exact file path, exact click-by-click step. Never vague advice like "consider posting more."
- When asked "what's the first step?", pick ONE next action from the plan below and spell it out fully.

## Brain ↔ hands protocol (the app)

The user runs `app/index.html` in a browser (double-click, no server). Data files are the channel — read/write them directly:

- **`app/tareas.json`** — YOU write tasks here (`titulo`, `detalle`, `categoria`, `vence` as `YYYY-MM-DD`, `hecha: false`, `origen: "cerebro"`, unique `id`). On each session start, read it: check which `hecha` flipped to `true` and factor that into your next instructions. Never delete user-added tasks (`origen: "tu"`); only append or update fields.
- **`app/data/prospectos.json`** — user adds prospects via the app. Read to know pipeline state (`estado`: Nuevo → Contactado → Respondió → Reunión → Cotizado → Cerrado / Sin respuesta). Each prospect has `monto` (number, MXN).
- **`app/data/mensajes.json`** — user's inbox to you. New items have `estado: "pendiente"`. **When the user says "revisa la app"/"ya terminé": read this first, then set `estado: "atendido"` and fill `respuesta` with your reply.** The app shows it under the message.
- **`app/data/clientes.json` · `cotizaciones.json` · `finanzas.json` · `contenido.json`** — company-control modules (projects w/ anticipo/saldo, quotes, cash flow + monthly goal, content calendar). Read them on each session; you may also write tasks/answers about them (e.g. remind follow-ups on pending quotes, flag low content cadence). `finanzas.metaMes` is the monthly revenue goal (default $10,000 MXN).
- **`app/data/agenda.json`** — reuniones con estados Próximamente/Realizada/Cancelada. Al marcar Realizada se pide `resultado` obligatorio.
- **`app/data/bitacora.json`** — log de eventos de valor (solo append, máx 500). Cada mutación genera un evento.
- **`app/data/reportes.json`** — reportes semanales generados por la app, completados por el cerebro.
- JSON must stay valid (UTF-8, no trailing commas) or the app shows stale localStorage cache silently.
- After updating any of these files, tell the user to hit **⟳ Sincronizar** in the app (or refocus the window).

## App structure

- `app/index.html` — solo markup + link a CSS + script src (sin JS inline)
- `app/styles.css` — design system completo (tokens, componentes, print)
- `app/app.js` — toda la lógica (state management, CRUDs, Dashboard, Kanban, reglas, bitácora, reportes)
- **13 secciones**: Dashboard · Pipeline · Proyectos · Agenda · Cotizaciones · Finanzas · Contenido · Métricas · Tareas · Mensajes · Bitácora · Reportes · Ayuda
- Pipeline es Kanban con drag-and-drop HTML5 y montos en MXN
- Motor de reglas en Dashboard (alertas para no dejar escapar dinero)
- Cotizaciones tienen documento imprimible (modal, `@media print`) y copia de texto para WhatsApp

## Execution state (as of 2026-09-22)

- Fases 1–4 of `PLAN-DE-ACCION.md` are ✅ complete (services, prices, portfolio, templates, sales system, prospecting system).
- **Next: Fase 5 — prospección activa.** North star: **`MODO-MILLONARIO.md`** (ritua diario 60 min, meta 50 contactos/semana). Immediate pending items from `00-Primeros-pasos.md`: publish `07-Marketing/Publicaciones/Portafolio-01-GMFire.md`, create the Google Sheets from `05-Prospectos/`, send the 10 prospects already pre-loaded in `app/data/prospectos.json`.
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
| `00-Primeros-pasos.md`, `PLAN-DE-ACCION.md`, `MODO-MILLONARIO.md` | Execution plan + live status + daily money north star (read `MODO-MILLONARIO.md` first) |
| `01-Empresa/` | Company identity, services, pricing, tech stack |
| `02-Portafolio/` | Project folders (01-04), each with a `Ficha.md` + `capturas/` |
| `03-Plantillas/` | Quote and diagnosis templates |
| `04-Ventas/` | Sales flow, contact scripts, payment rules |
| `05-Prospectos/` | Prospect sheet structure, weekly metrics (mirrored in Google Sheets) |
| `06-Clientes/` | Delivery checklists, post-sale procedures |
| `07-Marketing/` | Content calendar, social optimization, voice/tone, `Publicaciones/` |
| `08-Reuniones/` | Meeting format, meeting notes (`Actas/`) |
| `09-ITIL/` | ITIL v4 practices: incidents, problems, change control, SLA, knowledge base |
| `10-Infraestructura-Empresarial/` | Legal, fiscal, facturación, contratos, contabilidad |
| `11-Automatizacion-Contratacion/` | Process automation, hiring plan, payroll costs, labor obligations |
| `12-APIs-Tecnologias/` | APIs to integrate: billing, payments, email, AI, CRM, automation |
| `prospecting/` | Active prospect lists and WhatsApp message drafts |
| `app/` | Local ops app: `index.html` (double-click), `styles.css`, `app.js`, `tareas.json`, `data/prospectos.json`, `data/mensajes.json`, `data/clientes.json`, `data/cotizaciones.json`, `data/finanzas.json`, `data/contenido.json`, `data/agenda.json`, `data/bitacora.json`, `data/reportes.json` |

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
