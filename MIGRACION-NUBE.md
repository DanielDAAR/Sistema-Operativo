# MIGRACIÓN-NUBE.md — D.Softworks OS en la nube

> Estado: **desplegado y verificado** el 2026-09-24. Este archivo es la memoria de la integración; léelo antes de tocar el nuevo stack.

## 1. Qué es

Reemplazo del modelo anterior (cada carpeta con su copia local de JSON) por un sistema **compartido en la nube** con dos usuarios (Daniel y César) sincronizándose en tiempo real. El repo `app/` viejo sigue existiendo como **copia de trabajo del cerebro** (los JSON que yo edito), pero ya no es la fuente de verdad ni la app que usan los humanos.

## 2. Arquitectura

```
Navegador (teléfono/PC)                     Nube
netlify: https://dsw-os.netlify.app  ─────▶  Supabase: dsw-os (ref pwlajncxlifmlihisqwy)
  public/ (solo esto se publica)              . buckets (tabla única, un "archivo" por colección)
    index.html, styles.css                    . RLS: solo usuarios logueados
    app.js, config.js, _redirects             . realtime (publicación supabase_realtime)
                                              . Auth: 2 usuarios con email+password
```

- **Hosting:** Netlify, sitio `dsw-os` → `https://dsw-os.netlify.app`
- **Base de datos:** Supabase, proyecto `dsw-os`, región `sa-east-1` (Sao Paulo)
- **Modelo de datos:** tabla única `public.buckets` con columnas `name TEXT PK`, `data JSONB`, `updated_at timestamptz`. Un bucket por colección. Sincronización por *merge* con tombstones para borrados.

## 3. Componentes y rutas

| Archivo | Rol |
|---|---|
| `dsw-os-web/public/index.html` | App (navegadores) |
| `dsw-os-web/public/app.js` | Toda la lógica + capa de datos en la nube |
| `dsw-os-web/public/config.js` | `window.DSW_CONFIG` con Project URL + anon key (público por diseño) |
| `dsw-os-web/public/_redirects` | Bloqueo de respaldo a rutas internas |
| `dsw-os-web/netlify.toml` | Config de build (`publish = "public"`) |
| `dsw-os-web/supabase/schema.sql` | Definición de la tabla, RLS y realtime (ya ejecutado) |
| `dsw-os-web/tools/sync-data.js` | **Puente cerebro ↔ nube** (sin dependencias, Node 18+) |
| `dsw-os-web/tools/creds.json` | Credenciales del cerebro (service_role) — gitignoreado, nunca se despliega |

## 4. Credenciales (no escribir secretos aquí)

- **Service role y Project URL:** viven en `dsw-os-web/tools/creds.json` (gitignore) y en variables de entorno `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`. Solo el cerebro las usa.
- **Anon key:** en `public/config.js` (segura de publicar; RLS impide leer sin sesión).
- **Usuarios de la app** (Auth): `daniel@dssoftworks.mx` (Daniel, fundador), `cesar@dssoftworks.mx` (César) y `daamtz05@gmail.com` (Danny Hernández). Contraseñas entregadas por chat. Se cambian vía Admin API o en Supabase → Authentication → Users. OJO: hay dos Dannys (Daniel fundador y Danny Hernández): confirmar siempre cuál antes de tocar credenciales (incidente 16-oct-2026).
- El **PAT** de Supabase (`sbp_…`) usado para crear el proyecto **fue entregado por el usuario y debe estar revocado** una vez verificado el despliegue.

## 5. Flujo de trabajo

**Cerebro (yo, en sesiones):**
- Leer la nube: `node dsw-os-web/tools/sync-data.js pull` (baja TODOS a `app/` y `app/data/`)
- Editar los JSON locales como siempre
- Subir: `node dsw-os-web/tools/sync-data.js push tareas prospectos` (o sin argumentos = todos)
- `push` hace merge: win por `actualizado` más reciente; los tombstones se respetan
- Después de cada mutación, avisar al usuario: **pulsa ⟳ Sincronizar (o refoca la ventana)** en la app

**Humanos (Daniel, César):**
- Entran a `https://dsw-os.netlify.app`, login
- El botón **⟳ Sincronizar** baja + fusiona; los cambios se propagan entre dispositivos vía realtime

**Borrados en la app:** crean tombstones en `localStorage` (`dsw-tombs`) para que el merge no los resucite; el undo los limpia.

## 6. Redesplegar cambios de la app

```powershell
netlify deploy --prod --dir=public --functions=netlify/functions --site 90df0383-0852-4f9c-be3c-eda64b02e260 --message "motivo"
```
Correr desde `dsw-os-web/` (ahí vive `netlify.toml` con `publish` + `functions`).
Ojo: `--dir` anula el `publish` del `netlify.toml`; **siempre desplegar `dsw-os-web/public`, nunca la carpeta raíz** (ahí están `tools/` y `supabase/` con datos internos).

Variables de entorno obligatorias en el sitio (Site settings → Environment variables;
sin ellas `/.netlify/functions/crear-usuario` responde 500):
`SUPABASE_URL` · `SUPABASE_SERVICE_KEY` · `SUPABASE_ANON_KEY`.
Se ponen con `netlify env:set CLAVE valor --site <id>` (requiere `NETLIFY_AUTH_TOKEN`).
Deploy verificado 2026-10-16: 5 archivos + 1 función en vivo (`GET` a la función → 405,
`/tools/*` → 404, HTML sirve `app.js?v=7`).

## 7. Seguridad (verificada 2026-09-24)

- Solo `public/` está publicado; `/tools/*` y `/supabase/*` devuelven **404** en producción.
- RLS: `auth.role()='authenticated'` para select/insert/update/delete. Anon sin token → array vacío.
- SQL ejecutado una sola vez (idempotente). Una sola región: `sa-east-1`.
- Ojo al crear proyectos: `southamerica-east1` no es código válido; el correcto es `sa-east-1`.

## 8. Verificación final (2026-09-24)

- [x] Proyecto creado + schema aplicado
- [x] Datos sembrados: 16 prospectos, 8 tareas, 1 reunión, 14 eventos de bitácora (resto vacío)
- [x] Usuarios creados y confirmados (2)
- [x] Login anon→token funciona; lectura autenticada de los 10 buckets OK
- [x] Sitio en producción sirve `index.html`/`config.js`/`app.js` (200); internals 404
- [x] `node --check` en app.js / sync-data.js / config.js: sin errores
- [x] Corregido y redesplegado: la app **cargaba solo al refrescar/pulsar Sincronizar** tras el login; ahora `onAuthStateChange` con `SIGNED_IN` ejecuta `loadAll()` automáticamente
- [x] **Bug crítico raíz encontrado y corregido (causa de "no veo nada"):** `renderProyectos`/`renderCotForm`/`renderContForm` hacían `$('#cancelCEdit')`/`#cancelQEdit`/`#cancelKEdit`.addEventListener sobre botones que SOLO existen en modo edición → `TypeError` en `renderAll()` dentro de `loadAll()` → se abortaba la descarga de la nube (todo en cero). Guardados con `if(el)`. Verificado por E2E en Edge headless (CDP con login real): Pipeline 22 tarjetas, $33,300, sin excepciones. Deploy **v=4** (cache-bust `?v=4`).
- Verificación pendiente siempre en navegador real: **curl no ejecuta JS**; las pruebas de datos/API no detectan bugs de render. Usar E2E headless (ver `herramienta-e2e` en el repo temp) tras tocar `app.js`.

## 9. Troubleshooting

| Síntoma | Causa probable | Arreglo |
|---|---|---|
| Pantalla en blanco | localStorage cacheado con JSON viejo | Abrir en incógnito; borrar datos del sitio |
| No muestra datos nuevos | Merge pendiente de browsers | Pulsar **⟳ Sincronizar** en cada dispositivo |
| Alguien no ve un borrado | Tombstone solo en su navegador | Desde el app que borró, pulsa Sincronizar para publicar el tombstone |
| **App abierta pero TODO en 0 / vacío (sin datos tras login)** | **Bug JS en `renderAll()`**: `$('#cancelXEdit').addEventListener` sobre botón que solo existe en modo edición → excepción aborta `loadAll()` antes de descargar la nube | Corregido (guards `if(el)`). Si reaparece: revisar `renderAll()` por listeners sobre elementos condicionales |
| Script del cerebro no conecta | `creds.json` ausente o token revocado | Regenerar service_role en Supabase → Settings → API |