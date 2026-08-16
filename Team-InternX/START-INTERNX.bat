@echo off
title Launch InternX Application
cd /d "%~dp0"
echo ===================================================
echo     Launching InternX Full-Stack Platform...
echo ===================================================

start "InternX Backend" cmd /c run-backend.bat

where npm >nul 2>nul
if %errorlevel% equ 0 (
    start "InternX Frontend" cmd /c run-frontend.bat
    timeout /t 4 >nul
    start http://localhost:5173
) else (
    echo Opening application interface...
    timeout /t 2 >nul
    start "" "%~dp0index.html"
)
