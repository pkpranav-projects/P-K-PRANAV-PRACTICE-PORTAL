@echo off
title PRANAV Practice JAVA - Live Cloud Tunnel
cls
echo =========================================================
echo    PRANAV Practice JAVA - Instant Free Public Hosting
echo =========================================================
echo.
echo Starting secure Cloudflare Tunnel for localhost:5000...
echo.
echo Your app will be accessible worldwide via HTTPS!
echo Keep this window open while sharing.
echo.

cloudflared tunnel --url http://localhost:5000
pause
