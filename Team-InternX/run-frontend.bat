@echo off
title InternX Frontend Web Dashboard
cd /d "%~dp0"

where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting React Vite Frontend Dev Server...
    cd frontend
    if not exist node_modules (
        echo Installing dependencies...
        call npm install
    )
    call npm run dev
) else (
    echo Node.js not detected on PATH. Opening standalone web interface...
    start "" "%~dp0index.html"
)
