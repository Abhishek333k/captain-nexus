@echo off
title SilenVault Taxi Ecosystem Dev Controller
color 0E

echo ===================================================
echo   SILENVAULT TAXI ECOSYSTEM - LOCAL RUNNER
echo   1. Zone Rapido    : rapido.taxi.silenvault.com  (Port 5173)
echo   2. Zone Admin     : admin.taxi.silenvault.com   (Port 5174)
echo ===================================================
echo.
cd /d "%~dp0"

echo [1/2] Starting Zone Rapido on http://localhost:5173...
cd "Zone Rapido"
start "SilenVault - Zone Rapido (Port 5173)" cmd /k "npx vite --host --port 5173"

echo [2/2] Starting Zone Admin on http://localhost:5174...
cd ..\"Zone Admin"
start "SilenVault - Zone Admin (Port 5174)" cmd /k "npx vite --host --port 5174"

cd ..
echo.
echo ===================================================
echo Local Servers Launched:
echo   - Zone Rapido    : http://localhost:5173
echo   - Zone Admin     : http://localhost:5174
echo   - Zone Taxi Home : Static file at "%~dp0Zone Taxi Home\index.html"
echo ===================================================
pause
