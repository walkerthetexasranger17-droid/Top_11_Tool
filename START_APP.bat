@echo off
setlocal
cd /d "%~dp0"
title Top Eleven Tool v0.6.22
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0START_APP.ps1"
if errorlevel 1 (
  echo.
  echo The local app server stopped with an error.
  pause
)
endlocal
