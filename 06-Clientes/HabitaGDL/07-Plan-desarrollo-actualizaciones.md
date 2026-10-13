# HabitaGDL — Plan de desarrollo y actualizaciones (dueño: el cerebro, ejecuta Daniel)

**Estado 13-oct-2026:** tesis en `1be0e07` (ETL 6 fuentes + IHT v1 + web scaffold, tests 23/23). QA 4/5.

## Roadmap (versiones, no fechas vagas)

| Versión | Contenido | Criterio de salida |
|---|---|---|
| **v0.1 S0+S1** ✅ | QA verde parcial, IHT v1, web scaffold | tests 23/23, build verde (HOY) |
| **v0.2 S1-geo** | AGEB/MGN + join IHT a AGEB (cierra GDL-4-filas) | QA 5/5 |
| **v0.3 S2-MVP** | mapa + pesos vivos + drawer + top 10 en Netlify | URL + Lighthouse ≥90 |
| **v0.4 S3** | aire/salud/riesgos/seguridad + PDF tesis + defensa | jurado aprueba |
| **v1.0** | costo-habitabilidad con IIEG por colonia + DOI/licencia | repo citable |

## Política de actualizaciones (reglas, no deseos)

1. **Cada cambio entra por test o no entra.** `tests/test_s*.py` en verde antes de cada push a tesis.
2. **Parquet versionados por contenido:** si cambia un ETL, se regenera y se commitea el Parquet con el código (trazabilidad tesis).
3. **Frontend lee solo `public/data/`** (contrato). Nada de crudos en la web.
4. **`npm run build` verde siempre** en habita-web. Lo que rompa el build se revierte el mismo día.
5. **Un commit = una idea** (`feat/fix/docs/test`), en español, con números (filas, checks).
6. **Viernes:** `habita.js` + tests + actualizar este archivo (avance real, no intenciones).

## Próximas 3 ejecuciones (orden)

1. **t-031** ✅ scaffold hecho → falta CI (`.github/workflows/ci.yml`: pytest equivalente + build).
2. **S1-geo:** descargar MGN Jalisco AGEB urbana (INEGI) + join espacial (geopandas) → IHT v2 a nivel AGEB.
3. **S2-MVP:** `lib/duckdb.ts` + `MapaIHT` + `PesosIHT` (ver `habita-web/README-HABITA.md`).

## Qué se lleva la empresa

Este archivo es la plantilla de "plan de desarrollo" para el próximo sistema a medida que se venda: roadmap por versiones con criterios de salida + política de updates. Cuando HabitaGDL llegue a v0.3, se copia a `03-Plantillas/Plan-desarrollo.md`.
