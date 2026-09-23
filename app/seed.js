var SEED_DATA={
  "tareas":{"actualizado":"2026-09-23","tareas":[]},
  "prospectos":{"actualizado":"2026-09-23","prospectos":[]},
  "clientes":{"actualizado":"2026-09-23","clientes":[]},
  "cotizaciones":{"actualizado":"2026-09-23","cotizaciones":[]},
  "finanzas":{"actualizado":"2026-09-23","metaMes":10000,"movimientos":[]},
  "contenido":{"actualizado":"2026-09-23","publicaciones":[]},
  "agenda":{"actualizado":"2026-09-23","reuniones":[]},
  "bitacora":{"actualizado":"2026-09-23","eventos":[{"id":"b-001","fecha":"2026-09-23","tipo":"sistema","titulo":"Sistema DSW OS listo","detalle":"Datos de ejemplo limpiados — esperando datos reales","monto":0,"origen":"cerebro","actualizado":"2026-09-23"}]},
  "reportes":{"actualizado":"2026-09-23","reportes":[]},
  "mensajes":{"actualizado":"2026-09-23","mensajes":[]}
};
localStorage.setItem("dsw-seed",JSON.stringify(SEED_DATA));
window.SEED_DATA=SEED_DATA;