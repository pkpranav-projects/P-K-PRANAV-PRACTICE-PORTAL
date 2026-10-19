@echo off
title Push PRANAV Practice JAVA to GitHub
cls
echo =========================================================
echo    Push PRANAV Practice JAVA to GitHub
echo =========================================================
echo.
echo Make sure you created an empty repo on GitHub:
echo https://github.com/new
echo (e.g. named: java-practice-arena)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (or press Enter for default https://github.com/pkpranav-projects/java-practice-arena.git): "
if "%REPO_URL%"=="" set REPO_URL=https://github.com/pkpranav-projects/java-practice-arena.git

echo.
echo Setting remote to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
echo.
echo Pushing branch 'main' to GitHub...
git branch -M main
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo =========================================================
    echo SUCCESS! Your code is now live on GitHub.
    echo Now you can connect it to Render.com for 24/7 hosting.
    echo =========================================================
) else (
    echo =========================================================
    echo Push failed. If the repository doesn't exist yet,
    echo create it at https://github.com/new and run this again.
    echo =========================================================
)
echo.
pause
