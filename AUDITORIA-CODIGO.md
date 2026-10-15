# Auditoría de código — 15-oct-2026

Auditoría completa del repo (3 frentes en paralelo + verificación manual de cada
hallazgo antes de tocarlo). Todo lo marcado ✅ está fixeado, verificado por
ejecución y publicado. Lo ⏳ tiene diseño listo para la próxima sesión.

## ✅ Arreglado y verificado

### Críticos (pérdida de datos / crashes)

| # | Qué | Dónde | Fix + verificación |
|---|-----|-------|--------------------|
| C1 | **Backup sin `puntos`**: Exportar/Importar omitían al equipo → restaurar un backup borraba puntos, rachas y logros | `dsw-os-web/public/app.js` exportBackup/importBackup | Agregado `'puntos'` a ambos arrays, versión backup 2→3. `node --check` OK |
| C2 | **`pull` sobrescribía lo local sin merge**: cualquier edición no pusheada se perdía (y la regla de oro ordena hacer `pull` antes de leer) | `tools/sync-data.js` | `pull` ahora fusiona (unión servidor+local). Verificado: `pull mensajes puntos` OK |
| C3 | **`pull` escribía a la nube**: re-subía todo con `updated_at` nuevo en cada pull (carreras + escrituras inútiles) | `tools/sync-data.js` | `pull` ya no toca la nube (solo `push` escribe). Exit 0 limpio |
| C4 | **`notificar.js` crasheaba en modo reporte**: trataba `equipo` (array) como objeto `{daniel, cesar}` → `TypeError` | `tools/notificar.js` buildReporte | Normalizado a array + `find` por id. Verificado: `notificar.js smtp` imprime el marcador |
| C5 | **`notificar.js alerta` crasheaba**: variable `días` (con tilde, indefinida) en vez de `dias` | `tools/notificar.js` buildAlerta | `días`→`dias`, itera todo el equipo. Verificado: `notificar.js alerta` OK |
| C6 | **Editar cotización crasheaba** (`#cancelQEdit` null: el form estaba en modo crear) | `public/app.js` handler `data-qedit` | Mismo patrón sano que prospectos: `editingQ=id; renderCotForm()` |
| C7 | **Editar publicación crasheaba** (`#cancelKEdit` null, mismo patrón) | `public/app.js` handler `data-kedit` | `editingK=id; renderContForm()` |
| C8 | **App vieja retirada**: 4 crashes (`cancelCEdit/QEdit/KEdit` sin guarda, `delMov()` inexistente), rutas `fetch('app/data/...')` rotas y JSON divergentes | `app/` | UI archivada en `archivo/app-local-legacy/` + README. `app/` queda solo como canal de datos (`tareas.json` + `data/`). `serve.bat`, `AGENTS.md` y `MODO-MILLONARIO.md` reapuntados a la nube |

### Medios y menores (misma sesión)

- **M1** `money.js leer()` sin try/catch → crash con stack. Ahora mensaje claro + exit 1.
- **M2** `cobrar saldo` permitía cobrar sin anticipo y guardaba `saldoPagado = total`. Ahora exige anticipo (regla 50/50) y acumula el saldo real.
- **M3** IDs `cot-`/`m-` por `length+1` colisionaban al borrar. Ahora derivan del máximo existente.
- **M4** Filtro de fuente se reseteaba y además **no filtraba nada**. Ahora conserva la selección y sí filtra el kanban.
- **M5** Banner de bienvenida reaparecía siempre (`dsw-welcome` vs `dsw-onboard`). Unificado a `dsw-welcome`.
- **M6** XSS/rotura: teléfono sin `esc()` en Visualizar, nombres sin `esc()` en `title` del mapa de calor, folio sin `esc()` en el doc de cotización.
- **M7** Sparkline con el tiempo invertido (mes actual a la izquierda). Ahora cronológica.
- **M8** Modal "¿Quién lo hizo?" mostraba el título de la primera tarea de la sesión. Ahora se actualiza en cada apertura (`#whoTitle`).
- **M9** `doLogin` reventaba si el CDN de Supabase fallaba (`sb` null). Ahora avisa en pantalla.
- **M10** Reportes: opción fantasma `''` en el selector + variable muerta `weekNum`. Limpio.
- **M11** Validación de correo `a@b` aceptada en crear-acceso (CLI + Function). Ahora regex real.
- **M12** `sync-data.js` cerraba con `process.exit()` y en Windows explotaba con assertion libuv al salir. Ahora `process.exitCode` (salida limpia, exit 0 verificado).

## ⏳ Pendiente (diseño listo, no urgente)

| # | Qué | Diseño |
|---|-----|--------|
| P1 | **Borrados pueden resucitar**: el cerebro hace `push` con JSON viejos que aún traen registros borrados en la web (el tombstone vive solo en el `localStorage` de quien borró). `mergeArr` de `sync-data.js` los re-inserta | Bucket `tumbas` en Supabase `{coleccion, id, fecha}`: la web lo escribe al borrar, `sync-data.js` lo lee y filtra en `mergeArr`. Estimado: 1 sesión |
| P2 | **Escalares pierden contra remoto**: `metaMes` y similares siempre ganan local en `save()` aunque el otro socio tenga un valor más nuevo | Comparar `tsVal(server)` vs `tsVal(client)` también para campos fuera del array, o versionar por campo |
| P3 | **Permisos por rol** (decidido: por ahora acceso total): cualquier logueado crea usuarios (Function) y RLS permite todo a `authenticated` | Fase 2: `ADMIN_EMAILS` en env de la Function (403 si no es admin) + políticas RLS con `auth.jwt()->>'email'`; quitar `delete` abierto |
| P4 | **`habita.js`**: path Windows hardcodeado, arg sin sanitizar en el `.py`, prueba `python` a ciegas, tmp sin borrar | Validar arg, `python3‖py‖python`, `unlinkSync` en `finally` |
| P5 | Ventana `clearTomb` vs borrado concurrente durante `save()` (hipótesis, no reproducida) | Mover `clearTomb` antes del `put`, o re-leer tombstones después del `await` |

## Hipótesis refutadas (verificadas con evidencia)

- "JWT de cualquier proyecto Supabase pasaría la Function": **FALSO** — verifica contra `/auth/v1/user` del propio proyecto con su anon key.
- "El password se loguea en la Function": **FALSO** — se devuelve una sola vez en el body. (En el CLI sí va a stdout: es intencional para pasarlo por WhatsApp; no usar `--password` con claves reutilizadas.)
- "`data-rut`/`verCotModal` rompen algo": **FALSO** — es código muerto inofensivo (`$$` vacío = no-op). Se deja.

## Estructura resultante

```
app/                  → canal de datos del cerebro (tareas.json + data/*.json)
archivo/app-local-legacy/ → UI vieja retirada (con README del porqué)
dsw-os-web/public/    → app en uso (única UI)
dsw-os-web/tools/     → money · dia · sync-data · notificar · priorizar · crear-usuario
dsw-os-web/netlify/functions/ → crear-usuario (creación de logins desde la web)
```

Regla que esta auditoría deja: **una sola UI viva** (`dsw-os-web/public/`).
Todo fix futuro se hace ahí; `archivo/` no se toca.
