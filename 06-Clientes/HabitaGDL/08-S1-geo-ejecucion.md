# HabitaGDL — S1-geo ejecutado (13-oct-2026)

**Commit tesis:** AGEB + IHT v2 + CI · **Tests:** 28/28 VERDE (S0 11 + S1 12 + geo 5) · **QA: 5/5 VERDE** (cierra QA-1).

## Qué se hizo

1. **AGEB urbana ZMG (1,724):** descarga CONABIO 2019 (42 MB nacional, no se commitea — `.gitignore` + script documentado), filtro 5 municipios (GDL 442, Zapopan 502, Tlajomulco 337, Tlaquepaque 234, Tonalá 209). `ageb_zmg.geojson` web-ready.
2. **IHT v2 por AGEB:** join nearest-centroid en UTM 13N (point-in-polygon solo cubría 45/1724 porque los pueblos rurales están fuera de AGEBs urbanas — documentado en código). 100% cobertura, `dist_km` guardada por AGEB = trazabilidad. Metodología honesta: el IHT se calcula a nivel localidad, la AGEB lo hereda y así se etiqueta en UI.
3. **CI:** `.github/workflows/ci.yml` (pytest-equivalentes + `npm run build`).
4. **H16 actualizado:** el check GDL ahora lee `iht_ageb.geojson` (442 AGEBs).

## Decisiones que blindan la tesis

- Coordenadas DMS→decimal (`_dms`): sin esto TODA la cercanía salía NaN.
- Umbral ≥10 viviendas: % con denominador mínimo son ruido.
- Localidades homónimas: join por clave ENT-MUN-LOC, no por nombre.
- DBF con mojibake: fix documentado, no silencioso.

## Siguiente (S2-MVP)

`lib/duckdb.ts` → `MapaIHT` (coropleta con `iht_ageb.geojson`) → `PesosIHT` → drawer + top 10 → Netlify. Ver `habita-web/README-HABITA.md`.
