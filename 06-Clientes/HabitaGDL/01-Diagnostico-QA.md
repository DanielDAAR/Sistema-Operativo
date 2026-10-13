# HabitaGDL — Diagnóstico QA (verificado 13-oct-2026)

**Método:** lectura directa de `src/*.py` + `src/etl/*.py` + `src/schemas/data_models.py` y conteo real de los 12 Parquet en `data/processed/`. Nada de lo de abajo es estimado: son números leídos por script.

## Resultado global: 🟡 BASE SÓLIDA, 5 DEFECTOS QUE FRENAN EL IHT

| # | Hallazgo | Evidencia | Impacto | Acción (dueño + fecha) |
|---|---|---|---|---|
| 1 | **Guadalajara casi no existe en ITER-localidad** | `iter_zgm.parquet`: 534 filas → … **Guadalajara 4**. … | ✅ **CERRADO 13-oct (S1-geo, IHT v2):** 1,724 AGEBs urbanas (GDL 442) con IHT heredado de la localidad más cercana (nearest-centroid UTM, `dist_km` guardada). `iht_ageb.geojson` web-ready. Metodología documentada en código. | Hecho. |
| 2 | **Aire: 3 estaciones perdidas en el ETL** | … | ✅ **CERRADO 13-oct (S0, commit 14e26e3):** Param traía Estación↔Abreviatura cruzadas; `parse_stations` intercambia. Lecturas 87,840→114,192, daily 3,660→4,758. | Hecho. |
| 3 | **`services_inegi.parquet`: 59 filas pero `total` todo NaN** | … | ✅ **CERRADO 13-oct (S0):** el XLS trae UNA consulta real (energía eléctrica); parser por bloques → 15 filas con números. Jalisco 99.03%. Resto de variables vía ITER. | Hecho. |
| 4 | **Encoding: verificado OK (falsa alarma descartada)** | Codepoints reales: `ú=0xfa, ñ=0xf1` correctos en ITER y services. El `�` era solo la fuente de la terminal, no los datos. | ✅ Ninguno: no tocar encoding. | Cerrado 13-oct (Daniel, verificado por script). |
| 5 | **`is_zgm` de salud siempre False + coords 0,0** | … | ✅ **CERRADO 13-oct (S0):** `norm_mun()` (mayúsculas, sin acentos) en ambas clases; coords SMT/TLA/VAL reales desde Param. | Hecho. |

## Lo que SÍ está bien (verificado)

- Pipeline corre por pasos (`python -m src.pipeline iter|air|health|iieg|services`) y `all` tolera fallos por etapa.
- Salud: **1,086 establecimientos** (GDL 496, Zapopan 330, Tlaquepaque 106, Tlajomulco 86, Tonalá 68), con coords y CLUES completos.
- Aire agregados listos para UI: daily 3,660 + monthly 120 + seasonal_wind 369 (rosas de viento por temporada).
- IIEG: 5 municipios con serie de hogares 2000→2020 (GDL 398,543 · Zapopan 425,194).
- `CONTEXTO_APP.md` es spec frontend completa y correcta (8 rutas, API FastAPI+DuckDB, a11y). No se toca.

## Orden de reparación (no negociable)

1. Services parser (1 h).
2. Estaciones COU/SAN/SMT (1 h).
3. `is_zgm` + coords (30 min).
4. AGEB/MGN (tarea grande, la única que pide semana completa).

## Cómo re-verificar (10 segundos)

```
node dsw-os-web/tools/habita.js "C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL"
```

Verde = los 5 puntos de arriba corregidos. Amarillo = tesis defendible pero con notas. Rojo = no presentar.
