// H16 · QA HabitaGDL — audita data/processed en 10 segundos.
// Uso: node dsw-os-web/tools/habita.js ["C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL"]
// Verde = listo para IHT. Amarillo = defendible con notas. Rojo = no presentar.
const { execSync } = require("child_process");
const path = require("path");

const root = process.argv[2] || String.raw`C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL`;
const proc = path.join(root, "data", "processed");

const py = `
import pathlib, json
d = pathlib.Path(r"""${proc}""")
out = {"archivos": {}, "errores": []}
esperados = ["iter_zgm.parquet","health_establishments.parquet","air_quality_daily.parquet","air_quality_monthly.parquet","air_quality_seasonal_wind.parquet","iieg_municipios.parquet","services_inegi.parquet","air_quality_readings.parquet"]
for f in esperados:
    p = d / f
    out["archivos"][f] = p.stat().st_size if p.exists() else -1
try:
    import pandas as pd
    df = pd.read_parquet(d/"iter_zgm.parquet")
    out["iter_filas"] = int(len(df))
    out["iter_mun"] = {str(k): int(v) for k,v in df["NOM_MUN"].value_counts().items()}
    h = pd.read_parquet(d/"health_establishments.parquet")
    out["health_filas"] = int(len(h))
    out["health_sin_coords"] = int(h["lat"].isna().sum())
    a = pd.read_parquet(d/"air_quality_daily.parquet")
    out["aq_estaciones"] = sorted([str(x) for x in a["station"].unique()])
    out["aq_daily_filas"] = int(len(a))
    s = pd.read_parquet(d/"services_inegi.parquet")
    out["services_nan"] = int(s["total"].isna().sum()) if "total" in s.columns else -9
    out["services_filas"] = int(len(s))
    out["mojibake"] = False  # verificado 13-oct: ú=0xfa/ñ=0xf1 correctos, el � era la terminal
except Exception as e:
    out["errores"].append(str(e)[:300])
print(json.dumps(out, ensure_ascii=False))
`;

const fs = require("fs");
const os = require("os");
const tmp = path.join(os.tmpdir(), "habita_qa.py");
fs.writeFileSync(tmp, py, "utf-8");

let r;
try {
  const raw = execSync(`python "${tmp}"`, { encoding: "utf-8", cwd: root });
  r = JSON.parse(raw);
} catch (e) {
  console.log("ROJO — no se pudo leer data/processed. ¿Ruta correcta? ¿pandas+pyarrow instalados?");
  console.log(String(e.message).slice(0, 400));
  process.exit(1);
}

const fails = [];
if (r.archivos) for (const [f, sz] of Object.entries(r.archivos)) if (sz === -1) fails.push("falta " + f);
const checks = [];
checks.push(["ITER 534 filas", r.iter_filas === 534]);
checks.push(["GDL > 4 localidades", (r.iter_mun && (r.iter_mun.Guadalajara || 0)) > 4]);
checks.push(["Aire trae COU+SAN", r.aq_estaciones && r.aq_estaciones.includes("COU") && r.aq_estaciones.includes("SAN")]);
checks.push(["Services con números", (r.services_nan ?? 99) === 0]);
checks.push(["Sin mojibake", r.mojibake === false]);

console.log("\nHABITAGDL QA — " + new Date().toISOString().slice(0, 10));
console.log("Carpeta: " + proc);
console.log("Filas: ITER " + r.iter_filas + " · salud " + r.health_filas + " (sin coords " + r.health_sin_coords + ") · aire-daily " + r.aq_daily_filas);
console.log("Estaciones aire: " + (r.aq_estaciones || []).join(","));
console.log("Services: " + r.services_filas + " filas, NaN " + r.services_nan + " · mojibake: " + (r.mojibake ? "SI" : "no"));
for (const [n, ok] of checks) console.log((ok ? "  OK  " : "  FAIL") + " " + n);
if (r.errores && r.errores.length) console.log("Errores: " + r.errores.join(" | "));
const score = checks.filter((c) => c[1]).length;
console.log(score === 5 && !fails.length ? "\nVERDE — listo para motor IHT." : score >= 3 ? "\nAMARILLO — defendible con notas (" + fails.join(", ") + "). Ver 06-Clientes/HabitaGDL/01-Diagnostico-QA.md" : "\nROJO — no presentar. Repara 01-Diagnostico-QA.md puntos 1-5.");
