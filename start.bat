@echo off
title Hostile Workplace server
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js is not installed.
  echo   Download the LTS version from https://nodejs.org, install it, and run this file again.
  echo.
  pause
  exit /b 1
)
start "" /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"
node server.js
pause
