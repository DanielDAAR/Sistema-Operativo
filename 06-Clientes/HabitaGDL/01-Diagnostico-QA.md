# HabitaGDL — Diagnóstico QA (verificado 13-oct-2026)

**Método:** lectura directa de `src/*.py` + `src/etl/*.py` + `src/schemas/data_models.py` y conteo real de los 12 Parquet en `data/processed/`. Nada de lo de abajo es estimado: son números leídos por script.

## Resultado global: 🟡 BASE SÓLIDA, 5 DEFECTOS QUE FRENAN EL IHT

| # | Hallazgo | Evidencia | Impacto | Acción (dueño + fecha) |
|---|---|---|---|---|
| 1 | **Guadalajara casi no existe en ITER-localidad** | `iter_zgm.parquet`: 534 filas → Tlajomulco 235, Zapopan 213, Tonalá 54, Tlaquepaque 28, **Guadalajara 4**. El municipio más denso aporta 4 renglones porque ITER a nivel localidad colapsa la mancha urbana. | 🔴 Crítico: el IHT no puede comparar colonias de GDL con este grano. | Conseguir AGEB urbana INEGI (MGN 2020) y re-hacer el join a ese nivel. Julio, 27-oct. |
| 2 | **Aire: 3 estaciones perdidas en el ETL** | `air_quality_daily`: 3,660 filas, estaciones presentes: AGU, ATM, CEN, LDO, MIR, OBL, PIN, SFE, TLA, VAL. **Faltan COU y SAN** (las únicas con NO/NO2/NOX completos) y SMT (nueva 2024). 87,840 lecturas crudas sí existen. | 🔴 Alto: se pierde el mejor sensor de Zapopan (COU) y Tlajomulco (SAN). | Revisar `parse_readings`: filtro `station not in stations_map` + columna `MES ` con espacio. Daniel, 20-oct. |
| 3 | **`services_inegi.parquet`: 59 filas pero `total` todo NaN** | Leído: `variable` OK, `total` NaN en las 59. Causa: `parse_services` busca el primer numérico en columnas 1+ pero el XLS real trae encabezados en `Viviendas/Unnamed:*` con celdas vacías. | 🟡 Medio: la dimensión Servicios del IHT hoy no tiene números. | Reescribir parser con `header` correcto o mapear por nombre de fila. Daniel, 20-oct. |
| 4 | **Encoding: verificado OK (falsa alarma descartada)** | Codepoints reales: `ú=0xfa, ñ=0xf1` correctos en ITER y services. El `�` era solo la fuente de la terminal, no los datos. | ✅ Ninguno: no tocar encoding. | Cerrado 13-oct (Daniel, verificado por script). |
| 5 | **`is_zgm` de salud siempre False + coords 0,0** | `HealthEstablishment.is_zgm` compara `municipio` ("ZAPOPAN") contra `MunicipioZMG` ("Zapopan") → nunca igual. Además `config.AQ_STATIONS` trae SMT/TLA/VAL en `lat:0, lon:0`. | 🟡 Medio: cualquier filtro que use `is_zgm` o mapa con esas 3 estaciones miente. | Comparar en mayúsculas sin acentos; completar coords SMT/TLA/VAL de SEMADET. Julio, 27-oct. |

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
