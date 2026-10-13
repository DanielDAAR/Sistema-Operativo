# HabitaGDL — Expediente como Empresa Real

**Cliente:** HabitaGDL (proyecto de graduación CETI Colomos / Universidad de Colima)
**Tratamiento:** cliente interno tipo "sistema a medida". Se procesa con la misma disciplina que un cliente que paga: alcance firmado, diagnóstico con evidencia, cotización interna, entregables y bitácora.
**Autores / responsables:** Daniel Aldana Rubio (datos + backend) · Julio Cesar Ortiz Becerra (datos + frontend)
**Fecha de alta:** 13-oct-2026
**Repo:** https://github.com/DanielDAAR/HabitaGDL.git
**Carpeta de datos (origen):** `C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL`
**Estado:** Etapa 3 de 5 (ETL base hecho, falta IHT + frontend + riesgos/seguridad)

---

## 1. Qué es (en una línea)

Sistema que integra datos oficiales de vivienda, servicios, salud, aire y precios en un **Índice de Habitabilidad Territorial (IHT 0-100)** + métrica **costo-habitabilidad**, para responder "¿dónde sí conviene vivir en la ZMG?".

## 2. Alcance firmado (tesis vs producto)

| Incluye (tesis, compromiso) | No incluye (salvo que se cotice aparte) |
|---|---|
| ETL de 5 fuentes → Parquet en `data/processed/` | App móvil nativa |
| IHT 0-100 con 8 dimensiones y pesos configurables | Datos en tiempo real (todo es histórico 2020-2024) |
| Dashboard web 8 vistas (ver `CONTEXTO_APP.md`) | Integración con portales inmobiliarios privados |
| Metodología documentada + trazabilidad a fuentes | Certificación oficial del índice |
| 5 municipios ZMG: Guadalajara, Zapopan, San Pedro Tlaquepaque, Tonalá, Tlajomulco de Zúñiga | Resto de Jalisco / El Salto (solo aparece como estación de aire) |

**Regla de oro del expediente:** todo lo que salga de esta tabla pasa por cotización antes de hacerse.

## 3. Valor interno (por qué se trata como empresa real)

1. **Portafolio premium:** es el proyecto más complejo de D.Softworks (ETL + 87,840 lecturas + mapas). Vale más que 10 landings para conseguir clientes de dashboard.
2. **Línea vendible nueva:** "dashboards de datos abiertos para inmobiliarias / consultoras" (ver O-13 en el radar).
3. **Tesis blindada:** con disciplina de empresa (actas, QA, metodología) el jurado ve proceso profesional, no solo código.

## 4. Hitos y dueños

| Hito | Dueño | Fecha objetivo | Evidencia de done |
|---|---|---|---|
| QA ETL + corrección encoding y services | Daniel | 20-oct-2026 | `habita.js` en verde + `01-Diagnostico-QA.md` actualizado |
| ETL escuelas + geometrías AGEB/MGN | Julio | 27-oct-2026 | `escuelas.parquet` + GeoJSON localidades |
| Riesgos (PDF→GeoJSON) + SHF precios + delito SESNSP | Daniel | 03-nov-2026 | 3 parquet nuevos |
| Motor IHT + pesos + ranking costo-habitabilidad | Ambos | 10-nov-2026 | `iht.py` + test con 3 colonias conocidas |
| MVP frontend (mapa + pesos + drawer + top 10) | Julio | 24-nov-2026 | URL pública + Lighthouse ≥90 |
| Documento de tesis + defensa | Ambos | dic-2026 | PDF + acta |

## 5. Reglas de operación

- D.Softworks cobra 50/50 a clientes externos. Aquí el "anticipo" es **horas**: 5 h/semana por persona, registradas en bitácora.
- Nada se publica sin QA (`node dsw-os-web/tools/habita.js`).
- Cada cambio al IHT lleva prueba con 3 zonas conocidas (ej. Providencia vs Loma Dorada vs Santa Fe) — si el ranking sale absurdo, el peso está mal, no la ciudad.
- Contacto del proyecto: WhatsApp +52 1 33 5051 9325 · GitHub github.com/DanielDAAR

## 6. Archivos del expediente

- `00-Ficha-empresa.md` (este archivo)
- `01-Diagnostico-QA.md` — auditoría técnica verificada 13-oct-2026
- `02-Cotizacion-interna.md` — cuánto valdría si se vendiera + qué deja como portafolio
- Herramienta **H16**: `node dsw-os-web/tools/habita.js [ruta]` — QA en 10 segundos
