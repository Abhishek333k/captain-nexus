@echo off
title Captain Nexus Dual-Zone Control Plane
color 0E

echo ===================================================
echo   CAPTAIN NEXUS - DUAL ZONE CONTROLLER
echo   Zone A: rapido.taxi.silenvault.com  (Port 5173)
echo   Zone B: admin.taxi.silenvault.com   (Port 5174)
echo ===================================================
echo.
cd /d "%~dp0"

echo [1/2] Starting Zone A (Public Operations Radar) on http://localhost:5173...
start "Captain Nexus - Zone A Public (Port 5173)" cmd /k "npx vite --host --port 5173"

echo [2/2] Starting Zone B (Admin Operations Portal) on http://localhost:5174...
cd Zone-B-Admin
start "Captain Nexus - Zone B Admin (Port 5174)" cmd /k "npx vite --host --port 5174"

echo.
echo ===================================================
echo Dual-Zone Servers Active:
echo   - Zone A (Public): http://localhost:5173
echo   - Zone B (Admin):  http://localhost:5174
echo ===================================================
pause
