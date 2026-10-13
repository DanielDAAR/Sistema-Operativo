# HabitaGDL — S0 ejecutado (13-oct-2026)

**Commit tesis:** `14e26e3` en github.com/DanielDAAR/HabitaGDL · **Tests:** `tests/test_s0.py` 11/11 VERDE · **QA:** 4/5 AMARILLO (solo falta GDL-granularidad → S1).

## Qué se reparó (causa raíz, no parche)

1. **Aire: +26,352 lecturas recuperadas.** La hoja Param traía Estación↔Abreviatura cruzadas en 3 filas (código donde iba el nombre). `parse_stations` ahora detecta e intercambia. Lecturas: 87,840 → **114,192**; daily 3,660 → **4,758**; monthly 120 → 156. De paso salieron las **coords reales de SMT/TLA/VAL** desde la misma hoja (se acabó el 0,0).
2. **Services honesto:** el XLS trae UNA consulta real (energía eléctrica por entidad), no 59 variables. Parser reescrito por bloques: `services_inegi.parquet` ahora = Nacional + 14 entidades hasta Jalisco (**Jalisco: 2,327,794 viviendas, 99.03% con energía**). Las demás variables de servicios salen de ITER (ya estaban). Tesis blindada: documentado, no inventado.
3. **`is_zgm` normalizado** (mayúsculas + sin acentos, `norm_mun` en `data_models.py`). El bug era real aunque el filtro del ETL no lo usaba.
4. **Miles con comas:** el XLS trae "35,156,897" como texto. `_to_float` ahora limpia comas/espacios.

## Quedó pendiente (S1, con dueño)

- GDL con 4 filas → AGEB/MGN (Julio, 27-oct). Es el único FAIL del QA.
- `habita-web` vacío + CI (t-031). Comandos en `03-Decision-stack.md` §4.

## Patrón para la empresa

Debuggear con el archivo real abierto antes de tocar código: los 3 bugs salieron de LEER el XLS (Param cruzada, bloque único, comas), no de adivinar. Proponer a Checklists al cerrar S2.
