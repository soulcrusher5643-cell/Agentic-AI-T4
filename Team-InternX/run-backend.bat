@echo off
title InternX FastAPI Backend
echo Starting InternX Backend Server on http://localhost:8000 ...
cd backend
python -m uvicorn main:app --port 8000 --reload
pause
