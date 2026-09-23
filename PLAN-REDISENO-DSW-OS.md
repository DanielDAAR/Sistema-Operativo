# PLAN — Rediseño DSW OS (panel de control de empresa millonaria)

**Fecha:** 2026-09-23 · **Estado:** aprobado por el usuario · **Ejecutar en orden, paso a paso.**
**Repo:** `C:\Users\espec\OneDrive\Desktop\DSoftworks — Sistema Operativo`
**App:** `app/index.html` (doble-click, sin build, sin dependencias externas de JS).

## 0. Reglas innegociables

1. **Cero emojis y cero glifos dingbat** en HTML, JS, toasts, seeds JSON y copy.
   Baneado: U+2600–27BF (☀️🌙📋✓✕✏️⟳…), U+1F300–1FAFF, U+2B00–2BFF, U+FE0F.
   Permitido: flechas tipográficas `→ ← ↑` (U+21xx) y texto normal.
   Sustitutos: sprite de iconos SVG inline; texto plano ("OK", "Cerrar", "Sincronizar").
2. **Idioma:** español (tú). Marca: navy `#0d121c` + cian `#63cfe4` (logo `logo_DSW.jpg`).
3. **No romper el circuito cerebro↔hands:** los JSON siguen siendo el canal.
   Tras cada sesión de cambios, avisar al usuario: «abre la app y pulsa Sincronizar».
4. **Nada de datos existentes se borra.** Solo campos nuevos con migración en `normalizeState()`.
5. Estructura de archivos objetivo (sin build, doble-click sigue funcionando):
   - `app/index.html` — solo markup + link a CSS + script src
   - `app/styles.css` — design system completo
   - `app/app.js` — toda la lógica
   - Actualizar `AGENTS.md`: quitar "single-file", documentar los JSON nuevos.

## 1. Dirección visual (fintech oscura tipo Stripe/Linear)

### Tokens (CSS custom properties en `:root`)

```css
--bg:#0a0e16; --surface:#111624; --surface-2:#161c2e; --border:#232c42;
--txt:#e8ecf4; --muted:#8b96ad; --accent:#63cfe4; --accent-dim:rgba(99,207,228,.12);
--ok:#3ecf8e; --warn:#f0b429; --danger:#f2555a; --radius:10px;
```

- Tipografía: `Inter, ui-sans-serif, system-ui, "Segoe UI", sans-serif`; **todas las cifras con `font-variant-numeric: tabular-nums`**; folios/IDs en `ui-monospace, "Cascadia Code", Consolas, monospace`.
- Elevación por **borde 1px**, no sombras. Foco: `outline:2px solid var(--accent)`.
- Chips: uppercase, 11px, peso 700. Tablas densas (filas 40px, hover surface-2).
- Iconos: **sprite SVG inline** `<symbol>` en el HTML (24×24, stroke 1.6): `i-dash, i-funnel, i-briefcase, i-calendar, i-file, i-wallet, i-image, i-chart, i-check, i-mail, i-timeline, i-report, i-help, i-sync, i-folder, i-plus, i-edit, i-trash, i-grip`.

### Layout

```
┌──────────────┬────────────────────────────────────────┐
│ Sidebar      │ Topbar: [título de sección] · [estado  │
│ ┌──────────┐ │ sync] [Sincronizar] [Conectar carpeta] │
│ │ DSW OS   │ ├────────────────────────────────────────┤
│ └──────────┘ │ Contenido (max-width 1200, padding 24) │
│ OPERACIÓN    │                                        │
│  Dashboard   │                                        │
│  Pipeline    │                                        │
│  Proyectos   │                                        │
│  Agenda      │                                        │
│ CAPITAL      │                                        │
│  Cotizaciones│                                        │
│  Finanzas    │                                        │
│ CRECIMIENTO  │                                        │
│  Contenido   │                                        │
│  Métricas    │                                        │
│ SISTEMA      │                                        │
│  Tareas      │                                        │
│  Mensajes(n) │                                        │
│  Bitácora    │                                        │
│  Reportes    │                                        │
│  Ayuda       │                                        │
└──────────────┴────────────────────────────────────────┘
```

- Sidebar fijo 236px, colapsable a 64px (solo iconos) bajo 900px → drawer con botón hamburguesa.
- Item activo: fondo `--accent-dim`, texto `--txt`, borde izquierdo 2px cian.
- Badge de cuenta en "Mensajes" (contador, sin glifos).
- Topbar muestra `h2` de la sección actual + chip de estado de conexión (punto + texto, ya existe la lógica `setConn`).

## 2. Especificación por módulo

### 2.1 Dashboard (nueva, pantalla inicial, `data-tab="dashboard"`)

Todo **calculado en vivo** de los JSON (sin fetch nuevo):

**Fila KPI (6 tiles):**
| Tile | Fórmula | Meta/sub |
|------|---------|----------|
| Ingresos del mes | Σ movimientos `ingreso` con `fecha.slice(0,7)===mesActual` | barra vs `finanzas.metaMes` |
| Pipeline ponderado | Σ `monto × prob[estado]` de prospectos ≠ Cerrado/Sin respuesta | subtítulo: pipeline bruto Σ monto |
| Cierres del mes | prospectos estado Cerrado con `fechaCierre` del mes (añadir campo `fechaCierre` al pasar a Cerrado) | meta: 3 |
| Tasa de respuesta | (Respondió+Reunión+Cotizado+Cerrado)/total prospectos ×100 | meta: 20% |
| Por cobrar | Σ (precio−anticipo) de clientes ≠ Entregado | rojo si > 0 y hay "Esperando pago" |
| Tareas hoy | vencidas + vencen hoy, no hechas | link a Tareas |

**Widgets (grid 2 col):**
1. **Prioridades de hoy** — tareas `!hecha && vence<=hoy` (máx 5) + botones CTA: "Enviar 10 contactos" → Pipeline; "Publicar hoy" → Contenido; "Seguimientos" → filtro Pipeline Contactado.
2. **Embudo** — 7 barras horizontales Nuevo→Sin respuesta con conteo y % de conversión entre etapas adyacentes.
3. **Motor de reglas** (ver §2.8) — lista de alertas con acción.
4. **Agenda próxima** — 3 próximas reuniones de `agenda.json`.
5. **Últimos movimientos** — 5 más recientes de `finanzas.json`.
6. **Sistema** — conectado/no, última sincronización, mensajes pendientes para el cerebro, "empresa operando desde" (primer evento de bitácora).

### 2.2 Pipeline (antes Prospectos)

- **Kanban** de 7 columnas por estado (Nuevo, Contactado, Respondió, Reunión, Cotizado, Cerrado, Sin respuesta) con **drag & drop nativo HTML5** (eventos `dragstart/dragover/drop`); fallback: select en cada tarjeta (como hoy).
- Tarjeta: nombre, negocio, **monto en MXN** (grande, tabular), chip estado, fuente, días desde último contacto.
- Campo nuevo en formulario y seed: **`monto`** (number, MXN). Si falta → `$0` y tarjeta muestra "sin monto" en muted.
- **Probabilidad por estado (constante en JS):**
  `Nuevo:.10 · Contactado:.20 · Respondió:.40 · Reunión:.60 · Cotizado:.80 · Cerrado:1 · Sin respuesta:.05`
- Al soltar tarjeta en Cerrado: setear `fechaCierre=today()` + **evento bitácora**.
- Botón convertir (icono `i-briefcase`, sin emoji) "Convertir en cliente" cuando Cerrado: mismo flujo actual (rellena form Clientes y cambia de pestaña).
- Filtro por fuente + botón copiar TSV (conservar).
- Header de la sección: 3 micro-KPIs: Total prospectos · Pipeline bruto · Pipeline ponderado.
- **Seeds de `monto`** (añadir a los 10 precargados):
  DEO Clinic 6000 · Tiny Smiles 2500 · Denticelis 2500 · La Matera 3500 · Alcalde 3500 · Somos Red 0 (alianza) · Dental Magaña 4500 · La Zapopana 4500 · PROJAL 8000 · Atelback 0 (alianza).

### 2.3 Proyectos (antes Clientes) — conservar tal cual, mejoras:

- Mismo CRUD + estados. Añadir: al pasar a **Entregado** → evento bitácora + toast "Cobrar saldo y pedir testimonio" (ya existe el toast; texto sin glifos).
- Stats superiores ya existen (Facturado / Por cobrar) — conservar con estilo KPI tile.

### 2.4 Agenda (nueva) — `app/data/agenda.json`

```json
{ "actualizado":"", "reuniones":[
  { "id":"", "titulo":"Reunión semanal de socios", "tipo":"Socios",
    "fecha":"2026-09-27", "hora":"10:00", "duracionMin":30,
    "participante":"Daniel + compañero", "notas":"Métricas, proyectos, próxima semana",
    "estado":"Próximamente", "resultado":"", "actualizado":"" } ] }
```

- Estados: `Próximamente | Realizada | Cancelada`.
- Form: título, tipo (Diagnóstico/Entrega/Socios/Otro), fecha, hora, duración, participante, notas.
- Al marcar **Realizada**: prompt por escrito para `resultado` (obligatorio) → guardar + **evento bitácora** (`tipo: "reunion"`).
- Orden: próximas (fecha asc) primero, después históricas (desc). Widget en Dashboard (3 próximas).

### 2.5 Cotizaciones → documento

- Migración en `normalizeState`: si `!Array.isArray(c.items)` → `items = [{descripcion: servicio||"Servicio", precio}]` desde `servicio/precio` legacy; `folio` si falta → `COT-2026-NNN` secuencial (NNN = posición+1 con pad 3).
- Form con **editor de ítems** (agregar/quitar filas descripción+precio); total = Σ items (campo `precio` legacy se mantiene = total, recalculado en save).
- Acciones por fila: **Ver documento** · Editar · Eliminar (con deshacer, como hoy).
- **Vista documento** (modal o subvista, imprimible con `@media print`):
  - Encabezado: DSW OS · D.Softworks · Guadalajara, Jalisco · WhatsApp +52 1 33 5051 9325 · `dsoftworks.netlify.app`
  - `COTIZACIÓN [folio]` · fecha · válida 15 días
  - Bloque cliente: nombre/negocio
  - Tabla ítems → **TOTAL MXN**
  - Condiciones: anticipo 50% / saldo contra entrega · transferencia o efectivo · 2 rondas de cambios (web/landing), 1 (catálogo) · no incluye: hosting renovación, cambios fuera de alcance
  - Botones: **Imprimir / PDF** (`window.print()`) · **Copiar texto** (plain text para WhatsApp)
- Stats fila (conservar): enviadas, % aceptación, monto aceptado, pendientes.
- Al marcar **Aceptada** → toast sin emoji + evento bitácora con monto + aviso "registrar anticipo en Finanzas".

### 2.6 Finanzas — conservar, mejoras:

- Mismos KPIs + barra de meta + movimientos. Sin emojis en labels ("Ingreso"/"Egreso" ya OK).
- Cada `addMov` → **evento bitácora** (`tipo:"cobro"` si ingreso / `"egreso"`), con monto.
- Borrar movimiento → evento de corrección (no se destruye historial: evento `movimiento-eliminado`).

### 2.7 Contenido y Métricas

- **Contenido:** conservar calendario + banner "Próxima publicación". Al marcar Publicada (prompt de enlace ya existe) → **evento bitácora**. Sin glifos.
- **Métricas:** conservar barras por estado/fuente + tiles actuales; añadir tile "Pipeline ponderado" y sparkline simple de ingresos por mes (SVG hand-rolled, últimos 6 meses desde `finanzas.json`; 0 si no hay datos).

### 2.8 Motor de reglas (Dashboard) — "que la app no deje escapar dinero"

Evaluar en cada render; cada regla = alerta con severidad + texto + CTA (cambia de pestaña/aplica filtro):

| # | Condición | Severidad | Copy | CTA |
|---|-----------|-----------|------|-----|
| R1 | cotización `Pendiente` con `fechaEnvio` hace ≥3 días | warn | "Cotización de {prospecto} sin respuesta desde hace N días" | Enviar seguimiento → Cotizaciones |
| R2 | prospecto `Contactado` con `fecha` hace ≥48h | warn | "N contactados sin seguimiento" | Ver lista → Pipeline filtro Contactado |
| R3 | día del mes ≥20 e ingresos < 40% de meta | danger | "Vas en X% de la meta con N días del mes" | Abrir Finanzas |
| R4 | contenido `Pendiente` con fecha ≤ hoy | warn | "Publicación de hoy pendiente: {titulo}" | Abrir Contenido |
| R5 | cliente `Esperando pago` con saldo >0 | danger | "Saldo por cobrar ${n} en {negocio}" | Abrir Proyectos |
| R6 | reuniones agenda `Próximamente` hoy/mañana | info | "Mañana: {titulo} con {participante}" | Abrir Agenda |
| R7 | ningún mensaje del cerebro atendido y hay ≥3 tareas vencidas | info | "Hay tareas vencidas; pide apoyo al cerebro" | Abrir Mensajes |

Si no hay reglas: fila "Sistema al día — nada urgente" (estado ok).

### 2.9 Bitácora de valor (nueva) — `app/data/bitacora.json`

```json
{ "actualizado":"", "eventos":[
  { "id":"", "fecha":"2026-09-23 10:00", "tipo":"sistema",
    "titulo":"Sistema DSW OS iniciado", "detalle":"Bitácora de valor activa",
    "monto":0, "origen":"cerebro|app", "actualizado":"" } ] }
```

- **Solo append** (nunca delete/edit en UI). Máx 500 eventos: si excede, recortar conservando los 500 más recientes (log de bytes, no de negocio).
- Helper `log(tipo, titulo, detalle, monto?)` llamado desde TODAS las mutaciones:
  `prospecto-estado · prospecto-cerrado · cliente-alta · cliente-estado · cotizacion-enviada · cotizacion-aceptada · cobro · egreso · movimiento-eliminado · publicacion · reunion · reporte · tarea-hecha` (tarea-hecha: solo si categoría != Personal, para no ruidar).
- UI: timeline vertical (punto + fecha mono + título + detalle + monto). Header: total de eventos + "Operando desde {primer evento}".
- El cerebro (IA) también escribe este archivo directamente.

### 2.10 Reportes semanales (nueva) — `app/data/reportes.json`

```json
{ "actualizado":"", "reportes":[
  { "id":"", "semana":"2026-W39", "rango":"2026-09-21 a 2026-09-27",
    "generado":"2026-09-25 18:00", "kpis":{
      "contactos":0,"contactosMeta":50,"respuestas":0,"tasaRespuesta":0,
      "reuniones":0,"cotizaciones":0,"cierres":0,"ingresos":0,"metaMes":10000,
      "pipelinePonderado":0,"publicaciones":0 },
    "analisis":"", "planSemana":[], "origen":"app|cerebro" } ] }
```

- Botón **"Generar reporte de la semana"**: la app calcula `kpis` desde los JSON (semana ISO: lunes-domingo, helper ya existe `weekStart()`), guarda/actualiza reporte de esa semana (`semana` como clave única, overwrite permitido solo si `origen==="app"` o vacío).
- Cuando el usuario diga "revisa la app", el cerebro completa `analisis` (3-5 líneas: qué funcionó, qué no, por qué) y `planSemana` (3-5 bullets accionables) poniendo `origen:"cerebro"`.
- UI: selector de semana + tarjeta de reporte (tabla KPIs vs meta con colores) + bloque "Análisis del cerebro" (placeholder "Pendiente — dile al cerebro: revisa la app") + histórico en lista.

### 2.11 Tareas · Mensajes · Ayuda (conservar, rediseñar cara)

- Tareas: mismo CRUD sobre `tareas.json`; sin emojis; rutina diaria se conserva pero labels "Mañana / Medio día / Noche / Semana".
- Mensajes: mismo flujo cerebro↔hands (crítico para AGENTS.md).
- Ayuda: texto actualizado (estructura sidebar, motor de reglas, bitácora, reportes, cotización documento), **sin emojis**.

## 3. Migración y seeds

1. `normalizeState()` extendido: `bitacora`, `reportes`, `agenda` con defaults; `prospectos[].monto ??= 0`; cotizaciones items/folio (§2.5).
2. Seeds nuevos: `bitacora.json` (evento inicial), `agenda.json` (reunión de socios dom 2026-09-27 10:00), `reportes.json` vacío, `contenido.json`/`prospectos.json`/`tareas.json` **limpios de emojis/dingbats** (revisar glifos tipo ⚠️ y similares).
3. Montos de prospectos: ver §2.2.
4. `save/loadAll/sync/focus` — ampliar a los 3 JSON nuevos (patrón `extraSnap()` ya existe; generalizar a todos).

## 4. Ejecución (orden estricto + "done" por paso)

| # | Paso | Done cuando… |
|---|------|--------------|
| 1 | `styles.css` design system + tokens + componentes (KPI, table, chip, kanban, timeline, modal, print) | CSS cubre todos los componentes listados; sin emojis |
| 2 | `index.html`: sprite SVG + sidebar + topbar + secciones (Dashboard nuevo + 12 existentes re-mapeadas) | Navega a las 13 secciones; ids únicos |
| 3 | Mover lógica actual a `app.js` sin cambiar comportamiento (tareas, prospectos, clientes, cotizas, finanzas, contenido, mensajes, métricas) | `node --check app/app.js` OK; app funcional igual que antes |
| 4 | Dashboard (KPIs + widgets + embudo) | Muestra números reales de los seeds |
| 5 | Pipeline Kanban DnD + monto + forecast + seeds con montos | Mover tarjeta cambia estado y valor del forecast |
| 6 | Bitácora: helper + hooks + pestaña | Cada acción del usuario deja evento visible en timeline |
| 7 | Reportes: generador + pestaña | Botón genera reporte con kpis correctos vs seeds |
| 8 | Cotización documento: items/folio/modal imprimible | Imprimir da cotización completa; copiar texto OK |
| 9 | Agenda CRUD + widget Dashboard | Marcar Realizada pide resultado y loguea |
| 10 | Motor de reglas | Con seeds: R4 visible si GM Fire sigue Pendiente hoy |
| 11 | Limpieza emojis globales (app + todos los JSON de `app/`) | grep = 0 resultados |
| 12 | `AGENTS.md`: estructura de archivos + JSON nuevos en protocolo | Archivo actualizado |
| 13 | Verificación final (§5) + avisar "Sincronizar" | Todo ✓ |

## 5. Verificación (obligatoria al final)

```powershell
# 1) JS válido
node --check app/app.js

# 2) JSONs válidos
Get-ChildItem app -Recurse -Filter *.json | ForEach-Object {
  try { Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null; "$($_.Name) OK" }
  catch { "$($_.Name) FAIL" } }

# 3) Selectores: cada $('#id') existe en index.html (script de auditoría de IDs únicos)
# 4) Cero emojis/dingbats
rg -P "[\x{2600}-\x{27BF}\x{1F300}-\x{1FAFF}\x{2B00}-\x{2BFF}\x{FE0F}]" app/
```

Esperado: `node --check` OK · todos los JSON OK · IDs: ALL PRESENT, NO DUPLICATES · rg: sin resultados.

## 6. Contexto útil

- Precios/servicios autoritativos: `01-Empresa/Precios.md`, `01-Empresa/Servicios.md`.
- Norte de dinero: `MODO-MILLONARIO.md` (metas: 50 contactos/sem, 20% respuesta, meta $10,000/mes, ticket $2,000+).
- Mensajes de venta: `prospecting/MENSAJES-WHATSAPP.md`, `prospecting/PROSPECTOS-GDL.md`.
- Git: remote `origin` = `https://github.com/DanielDAAR/Sistema-Operativo.git`, rama `master`. **No hacer commit/push sin que el usuario lo pida.**
- Tras terminar: decirle al usuario «abre app/index.html y pulsa Sincronizar» (icono SVG, sin glifo).
