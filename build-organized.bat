@echo off
echo Building BnC Partner Portal with organized structure...

REM Create dist directory structure
if not exist "dist" mkdir dist
if not exist "dist\js" mkdir dist\js
if not exist "dist\css" mkdir dist\css

echo Copying HTML pages...
copy "frontend\pages\*.html" "dist\" >nul

echo Copying backend JavaScript files...
copy "backend\auth\*.js" "dist\js\" >nul
copy "backend\config\*.js" "dist\js\" >nul
copy "backend\forms\*.js" "dist\js\" >nul
copy "backend\security\*.js" "dist\js\" >nul

echo Copying frontend assets...
copy "frontend\styles\*.css" "dist\css\" >nul
copy "frontend\assets\*.js" "dist\js\" >nul

echo Copying configuration files...
copy "vercel.json" "dist\" >nul
copy "package.json" "dist\" >nul

echo Build completed! Files are ready in dist/ folder.
echo.
echo Next steps:
echo 1. Deploy dist/ folder to Vercel
echo 2. Deploy apps-script/main/ files to Google Apps Script
echo 3. Update configuration URLs
echo.
pause