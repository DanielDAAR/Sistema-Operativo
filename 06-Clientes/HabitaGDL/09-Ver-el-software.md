# HabitaGDL — Cómo ver el software corriendo

**Servidor:** `npm run dev` en `habita-web/` → **http://localhost:3000** (en tu red local: `http://192.168.100.6:3000`).

## Qué vas a ver hoy (13-oct-2026)

- La página de arranque de Next.js (plantilla). El mapa IHT es S2-MVP, aún no existe: lo honesto es verlo como "terreno listo, casa por construir".
- Lo REAL ya visible: `habita-web/public/data/` tiene `iht_localidad.json` (221 localidades con IHT) + `manifest.json`. Ábrelos en el navegador:
  - `http://localhost:3000/data/manifest.json`
  - `http://localhost:3000/data/iht_localidad.json`

## Comandos

```powershell
cd "C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL\habita-web"
npm run dev      # desarrollo (lo que estás viendo)
npm run build    # verifica que todo sigue verde
```

## Para apagarlo

Ctrl+C en la terminal donde corre, o cierra la ventana. No gasta nada estando prendido (solo RAM local).

## Siguiente nivel (S2)

Mapa coropleta con `iht_ageb.geojson` + sliders + drawer + top 10. Cuando eso esté, esta guía se actualiza con el tour clic-por-clic para el jurado.
