@echo off
title PRANAV Practice JAVA
cd /d "%~dp0"

echo ===============================================================
echo                     PRANAV PRACTICE JAVA                       
echo ===============================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ to proceed.
    echo.
    pause
    exit /b 1
)

:: 2. Check Java Compiler
where javac >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Java compiler javac not found in PATH.
    echo Local code compilation may be unavailable until JDK is added to PATH.
) else (
    for /f "tokens=*" %%i in ('javac -version 2^>^&1') do echo [OK] %%i
)

:: 3. Verify Server Dependencies
if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    cd server
    call npm install
    cd ..
)

:: 4. Verify Client Build
if not exist "client\dist\index.html" (
    echo [INFO] Building frontend bundle...
    cd client
    if not exist "node_modules" call npm install
    call npm run build
    cd ..
)

echo.
echo [OK] Starting PRANAV Practice JAVA on http://localhost:5000 ...
echo [INFO] Opening default browser...
start http://localhost:5000

echo [INFO] Press Ctrl+C in this window at any time to stop the server.
echo.

:: 5. Launch Express Server
cd server
node src/server.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Server stopped with error code %ERRORLEVEL%.
    pause
)
