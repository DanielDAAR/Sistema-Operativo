@echo off
title D.Softworks OS - Servidor local
cd /d "%~dp0app"
echo.
echo  D.Softworks OS - servidor local
echo  Abriendo http://localhost:8000 
echo  Para detener el servidor, cierra esta ventana.
echo.
start "" http://localhost:8000
python -m http.server 8000 --bind 127.0.0.1