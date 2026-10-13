# HabitaGDL — Plan de tesis (entregables oficiales + ideas que la hacen defendible)

**Fecha:** 13-oct-2026 · **Repo publicado:** https://github.com/DanielDAAR/HabitaGDL.git (rama `main`, 2 commits, push verificado)
**Modalidad CETI:** Tesis profesional, equipo de 2 (máx 4) · **Fuentes:** Reglamento de Titulación CETI DI-RG-200-13-01 Rev. D + Lineamientos UdeC 2007.

## 1. Entregables según la universidad (checklist oficial)

### CETI — lo que el Comité te va a pedir (Art. 5, 11, 19, 23)

- [ ] **Anteproyecto registrado** ante el Comité de Titulación (Art. 23) — es el PRIMER papel. Sin esto no hay asesor ni jurado.
- [ ] **Asesor técnico + asesor metodológico** asignados (Art. 19-21; al menos uno docente CETI). Pueden proponer ustedes.
- [ ] **Documento de tesis** según **Guía de estilo DI-VA-200-22-02** (Educación Superior) — pedirla YA en coordinación, todo el formato depende de ella.
- [ ] **Examen recepcional:** presentación + defensa ante Jurado de 3 (Presidente, Secretario, Vocal; se aprueba con 2/3 votos). Si no apruebas, reintento en 30 días.
- [ ] **Trámite administrativo:** Certificado de terminación + Constancia de servicio social + pagos + requisitos DGP (Art. 5). Vigencia: 2 años tras aprobar.
- [ ] Toma de protesta al aprobar (ese día salen titulados).

### UdeC — estructura del documento (vale para ordenar tus capítulos)

Portada → portada interna → **carta del asesor** (trabajo aceptado) → agradecimientos → índice → **resumen ≤250 palabras** (objetivo + método + hallazgos) → **introducción** (estado del arte, problema, pregunta, objeto, objetivos, hipótesis, justificación + mapa de capítulos) → **4 capítulos**: 1) enfoque teórico, 2) metodología, 3) resultados (teoría vs datos), 4) conclusiones → bibliografía APA → anexos (encuestas, bases, registros).

Formato: carta, márgenes 3.0 izq / 2.5 resto, interlineado 1.5, 12 pt texto / 14 pt títulos, figuras junto a su mención con fuente.

## 2. Mapeo: tus capítulos ya casi existen

| Capítulo UdeC | Ya lo tienes en | Falta |
|---|---|---|
| 1. Teórico | `HabitaGDL.md` §1-2 (problema + fuentes) | Estado del arte: índices IMCO/INEGI/ONU-Hábitat vs el tuyo |
| 2. Metodología | `src/etl/` + `src/schemas/` (código = método) | § IHT: fórmula, normalización, pesos, análisis de sensibilidad |
| 3. Resultados | 12 Parquet + QA verificado | IHT calculado + ranking de 3 colonias + mapa |
| 4. Conclusiones | `02-Cotizacion-interna.md` (valor) | Responder la pregunta con números |

## 3. Siete ideas que la hacen tesis (no tarea escolar)

1. **IHT con pesos por perfil** (familias, asmáticos, inversionistas). Los índices oficiales son fijos; el tuyo se adapta al usuario. Esa es tu aportación #1.
2. **Métrica costo-habitabilidad** (IHT ÷ precio normalizado) con mapa IIEG por colonia + SHF +12.46%. Nadie en México publica ese cruce. Aportación #2.
3. **Viento + contaminación:** tus 369 rosas estacionales permiten decir *por qué* una zona respira peor, no solo *cuánto*. Eso es ciencia, no dashboard.
4. **Análisis de sensibilidad:** mueve los pesos ±10% y demuestra que el ranking no se rompe. Un jurado perdona datos viejos, no método frágil.
5. **Zero-backend reproducible:** DuckDB-WASM en el navegador, $0, cualquiera replica tu resultado. Trazabilidad fuente→pixel (cada indicador con link oficial).
6. **Lectura de equidad territorial:** Tlajomulco/Tonalá vs Zapopan con tus propios números (534 localidades, 1,086 clínicas). La tesis dice algo de la ciudad, no solo del código.
7. **Validación con terreno conocido:** Providencia vs Loma Dorada vs Santa Fe. Si el IHT ordena lo que todo tapatío sabe, el método queda validado sin encuesta cara.

## 4. Defensa en 15 minutos (guion)

1. El problema con 2 números (casa ~$4-6M, +12.5%; renta $26,139) → 2 min
2. Demo en vivo: muevo pesos → el mapa cambia → 5 min
3. Método en 1 slide (8 dimensiones, fórmula, sensibilidad) → 3 min
4. Hallazgo incómodo (GDL-centro con 4 filas: el dato oficial también esconde) → 3 min
5. Cierre: repo público + qué sigue → 2 min

## 5. Riesgos y cómo se cubren

| Riesgo | Cobertura |
|---|---|
| Jurado: "datos de 2020-2024, viejos" | Declarado en metodología + IIEG 2026 como capa fresca; el método no caduca |
| "¿Por qué no encuestaron?" | CLUES censal (1,086) + ITER censal: censo > encuesta para este objeto |
| "¿Y la seguridad?" | SESNSP por municipio como proxy declarado + limitación escrita (honestidad suma puntos) |
| Plagio/datos sin fuente | Cada Parquet lleva fuente + fecha (trazabilidad §5 de ideas) |
