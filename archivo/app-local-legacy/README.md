# Archivo — app local legacy (retirada 2026-10-15)

Estos archivos eran la app local anterior (`app/index.html` + `app.js` + `styles.css` + scripts).
Se archivaron, **no se borraron**, por la auditoría de código del 15-oct-2026
(ver `AUDITORIA-CODIGO.md` en la raíz):

- La app en uso es la nube: **https://dsw-os.netlify.app** (código en `dsw-os-web/public/`).
- La versión archivada tenía 4 crashes verificados (botones `cancelCEdit/cancelQEdit/cancelKEdit`
  sin guarda, `delMov()` inexistente, rutas `fetch('app/data/...')` rotas desde `app/`)
  y escribía JSON locales divergentes de la nube.
- El canal del cerebro NO se movió: sigue en `app/tareas.json` + `app/data/*.json`
  (se sincronizan con `node dsw-os-web/tools/sync-data.js pull|push`).
- `app/visualizador.html` sigue en su lugar (es solo lectura, sin escrituras).

Si algún día se necesita rescatar algo de aquí, el núcleo de negocio (mensajes,
kanban, reglas, cotizaciones) es idéntico al de `dsw-os-web/public/app.js`;
la diferencia está solo en la capa de persistencia.
