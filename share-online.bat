@echo off
title PRANAV Practice Portal - Cloudflare Live Public Tunnel
cls
echo =========================================================
echo    PRANAV Practice Portal - Cloudflare Public Tunnel
echo =========================================================
echo.
echo Starting enterprise Cloudflare Tunnel via HTTP/2 (Port 443)...
echo.
echo Your app will be accessible worldwide via official trycloudflare.com HTTPS!
echo Keep this window open while sharing.
echo.
cloudflared tunnel --protocol http2 --url http://localhost:5000
pause
