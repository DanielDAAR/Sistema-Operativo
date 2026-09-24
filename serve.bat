@echo off
title D.Softworks OS - Servidor local
cd /d "%~dp0"
echo.
echo  D.Softworks OS - servidor local
echo  Abriendo http://localhost:8000/app/index.html
echo  Para detener el servidor, cierra esta ventana.
echo.
start "" http://localhost:8000/app/index.html
python -m http.server 8000 --bind 127.0.0.1