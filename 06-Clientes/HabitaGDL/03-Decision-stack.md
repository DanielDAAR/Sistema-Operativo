# HabitaGDL — Decisión de stack, estructura y plan de sprints (ADR-001)

**Fecha:** 13-oct-2026 · **Tipo:** tesis personal (no cliente de paga), procesada con disciplina de empresa.
**Decide:** Daniel (tesis) con Julio. **Revisión:** cuando el MVP esté en Netlify.

## 1. Veredicto: el stack nuevo SÍ pasa la regla de la empresa

`01-Empresa/RUTA-TECNOLOGICA.md` dice que una tecnología entra solo si (a) un cliente la pide o (b) deja cobrar ≥3×. HabitaGDL pasa ambas:

- (a) La tesis exige ETL + índice + dashboard con mapas. Con HTML pelado no se defiende.
- (b) Habilita O-13 (dashboards $8,000-15,000 vs landings $1,500). Eso es 5-10×.
- Costo verificado hoy: Netlify free (100 GB + 300 min) y Supabase free (500 MB, 50k MAU) intactos → MVP a **$0**.

Lo que NO entra al MVP, por la misma regla: Supabase (sin login no se justifica), app nativa (PWA si acaso, Fase 2), GraphQL/K8s (prohibidos).

## 2. Lenguajes y piezas (tabla final, sin alternativas abiertas)

| Capa | Elección | Por qué en 1 línea |
|---|---|---|
| ETL + motor IHT | **Python** (pandas, pyarrow, geopandas, pytest) | Ya existe, reproducible, el jurado lo lee |
| Frontend | **TypeScript + React (Next.js App Router, export estático)** | Tipos evitan bugs de coords; estándar 2026 de dashboards |
| Datos en browser | **SQL vía DuckDB-WASM** | Lee Parquet sin backend, $0, validado en FOSS4G 2026 |
| Mapas | **MapLibre GL JS** (gratis, sin token) | Mapbox/MapTiler piden token; deck.gl solo si MapLibre se queda corto (diferido) |
| Gráficas | **Recharts** | Cubre radar/barras/series; ECharts solo si un chart no sale (diferido) |
| UI | **Tailwind + shadcn/ui** | Velocidad + base a11y para el requisito de tesis |
| Geo | **GeoJSON (MGN INEGI, AGEB urbana)** + join en Python | Resuelve el hallazgo #1 del QA (GDL con 4 filas) |
| Tests | **pytest** (ETL/IHT) + **1 test IHT + 1 e2e de mapa** (Vitest/Playwright) | Mínimo que blinda la defensa |
| Deploy | **Netlify** (sitio estático) | Stack de la empresa, despliegue automático vía GitHub |

## 3. Estructura (monorepo en el repo HabitaGDL, NO aquí)

```
HabitaGDL/
├── src/                    # ETL actual (se queda)
│   ├── iht/                # NUEVO: motor IHT (pesos, normalización, ranking)
│   └── etl/                # fix: services, COU/SAN, is_zgm
├── tests/                  # NUEVO: pytest (IHT con 3 colonias conocidas)
├── habita-web/             # NUEVO: Next.js App Router
│   ├── app/                # 8 rutas (/, localidad, comparar, aire, salud, riesgos, seguridad, metodologia)
│   ├── components/         # Mapa, PesosIHT, Drawer, Top10, Charts
│   ├── lib/                # duckdb.ts, iht.ts (mismo algoritmo que Python), api.ts
│   └── public/data/        # Parquet publicados + manifest.json
├── data/processed/         # CONTRATO (solo esto lee el frontend)
└── .github/workflows/ci.yml # NUEVO: pytest + build en cada push
```

**Contrato de datos (regla dura):** el frontend NUNCA lee crudos. Solo estos 8 + `manifest.json` (fecha, fuente, filas):

`iter_zgm` · `air_quality_daily/monthly/seasonal_wind` · `health_establishments` · `escuelas` (nuevo) · `riesgos_inundacion` (nuevo) · `iht_localidad` (nuevo, salida del motor).

## 4. Sprints (modo proyecto, a diciembre)

| Sprint | Fechas | Sale | Done = |
|---|---|---|---|
| **S0 base** | 13-20 oct | QA en verde + `habita-web` vacío + CI | `habita.js` 5/5 + `npm run build` verde |
| **S1 datos+IHT** | 21 oct-10 nov | AGEB/MGN + escuelas + `iht/` v1 | test 3 colonias con ranking sensato (Providencia > Loma Dorada > Santa Fe, o justificado) |
| **S2 MVP** | 11-24 nov | mapa IHT + pesos vivos + drawer + top 10 en Netlify | URL pública + Lighthouse ≥90 |
| **S3 cierre** | 25 nov-dic | 4 vistas resto + metodología + PDF tesis | Defensa con demo en vivo |

Comandos exactos S0 (en repo HabitaGDL):
```
npx create-next-app@latest habita-web --typescript --tailwind --app --no-src-dir
cd habita-web && npm i maplibre-gl recharts duckdb-wasm
npm run build
```

## 5. Modo empresa (qué se lleva D.Softworks)

Patrón extraído para mejorar entregas, probado primero aquí: **contrato de datos + QA de 10 s + test de 3 casos conocidos + CI en cada push**. Si funciona en la tesis, se propone a `06-Clientes/Checklists-entrega.md`. No se toca ese archivo hoy para no mezclar.
