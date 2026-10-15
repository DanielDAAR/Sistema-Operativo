@echo off
title D.Softworks OS - Servidor local
cd /d "%~dp0"
echo.
echo  D.Softworks OS - servidor local (solo para visualizador local)
echo  La app en uso esta en la nube: https://dsw-os.netlify.app
echo  Abriendo la nube y sirviendo archivos locales en :8000
echo  Para detener el servidor, cierra esta ventana.
echo.
start "" https://dsw-os.netlify.app
python -m http.server 8000 --bind 127.0.0.1
