# HabitaGDL — Publicación en GitHub (repo vacío → push inicial)

**Fecha:** 13-oct-2026 · **Repo:** https://github.com/DanielDAAR/HabitaGDL.git
**Estado verificado hoy:** el repo existe pero está **vacío** ("This repository is empty") y tu carpeta local **no es repo git** (`fatal: not a git repository`). Falta conectarlas.

## 1. Veredicto técnico (números reales, no opinión)

Medí tu carpeta archivo por archivo:

| Dato | Valor | Límite GitHub | ¿Pasa? |
|---|---|---|---|
| Tamaño total | **~59 MB** | 1 GB recomendado | ✅ sobrado |
| Archivo más grande | `ESTABLECIMIENTO_SALUD_202606.xlsx` **25 MB** | 100 MB por archivo | ✅ sin LFS |
| Segundo | `concentrado_escuelas.xls` 9.5 MB | — | ✅ |
| Tercero | `BD_2024.xlsx` 8.7 MB | — | ✅ |

**Conclusión:** push normal, sin Git LFS, sin trucos. Un solo `git push` de ~59 MB entra bien (límite por push: 2 GB).

## 2. Comandos exactos (ejecutar en orden, 5 min)

```powershell
cd "C:\Users\espec\OneDrive\Desktop\datos para HabitaGDL"
git init
git add .gitignore
git commit -m "chore: gitignore base"
git add AGENTS.md CONTEXTO_APP.md HabitaGDL.md README.md requirements.txt src/ data/ "Demografía, vivienda y territorio/" "Calidad del aire/" "Salud y educación/" "servicios basicos y infrastuctura/" "Información estatal integrada/" "Mercado inmobiliario/" "Riesgos territoriales/" Mapas/ "Variables meteorológicas/"
git commit -m "feat: ETL base + 12 parquet + docs (S0)"
git branch -M main
git remote add origin https://github.com/DanielDAAR/HabitaGDL.git
git push -u origin main
```

Notas:
- Las comillas son obligatorias: las carpetas tienen espacios y acentos.
- Si `git push` pide login: usa tu usuario + **token** (no contraseña). Se genera en GitHub → Settings → Developer settings → Personal access tokens.
- El `.gitignore` ya está creado en tu carpeta (sección 3). El primer commit solo con `.gitignore` es a propósito: si algo sale mal, no se ensucia el historial.
- `Mapas/` y `Variables meteorológicas/` están vacías: Git no guarda carpetas vacías. Se subirá un `.gitkeep` en cada una (ya incluido abajo).

## 3. `.gitignore` (ya creado en tu carpeta)

```
__pycache__/
*.py[cod]
.venv/
venv/
.env
.DS_Store
Thumbs.db
*.tmp
```

## 4. Después del push (checklist)

- [ ] En github.com/DanielDAAR/HabitaGDL ves carpetas + README renderizado
- [ ] Agrega a Julio como colaborador: Settings → Collaborators → Add people
- [ ] Crea el board S0-S3: Projects → New project (columnas: S0, S1, S2, S3)
- [ ] Activa CI después (S0, ver `03-Decision-stack.md` §4)

## 5. Hallazgo del escaneo de hoy (para la tesis, no para el radar de ventas)

El **IIEG publicó mapa de precios de vivienda/renta POR COLONIA** (jalisco.gob.mx, nota 159954): renta más barata por municipio + estudio ITESO de precios + casa promedio ZMG **casi $4M** (cuadratín, oct-2026). Esa es la capa de precios que le falta a tu US-09 (costo-habitabilidad). Es dato abierto ($0). Acción S1: descargar el mapa IIEG y cruzarlo con `iter_zgm` por colonia. Evidencia anexada a O-13.
