@echo off
title Captain Nexus - Local Server (Auto Refresh Session Every 10 Min)
color 0E

echo ===================================================
echo   CAPTAIN NEXUS - J1C RADAR & CITY OFFICES HUB
echo   SilentVault Geospatial Intelligence
echo ===================================================
echo.
echo [1/2] Navigating to repository path: %~dp0
cd /d "%~dp0"

echo [2/2] Launching Vite Localhost Dev Server on port 5173...
echo Note: Application browser session automatically refreshes every 10 minutes (600s).
echo.
echo Press Ctrl+C in this window anytime to terminate the server.
echo.

npx vite --host --port 5173
pause

