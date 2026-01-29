@echo off
echo 🚀 Building BnC Partner Portal for Production Deployment...
echo.

REM Clean and create dist directory
if exist "dist" rmdir /s /q dist
mkdir dist
mkdir dist\api

echo ✅ Copying HTML files...
copy "*.html" "dist\" >nul

echo ✅ Copying JavaScript files...
copy "*.js" "dist\" >nul

echo ✅ Copying CSS files...
copy "*.css" "dist\" >nul

echo ✅ Copying API functions...
copy "api\*.js" "dist\api\" >nul

echo ✅ Copying configuration files...
copy "vercel.json" "dist\" >nul
copy "package.json" "dist\" >nul

echo ✅ Copying source files...
if not exist "dist\src" mkdir dist\src
copy "src\*" "dist\src\" >nul

echo.
echo 📦 Build completed successfully!
echo.
echo 📁 Files ready in dist/ folder:
dir /b dist
echo.
echo 🌐 Ready for deployment to:
echo   - Vercel (recommended)
echo   - Netlify
echo   - GitHub Pages
echo   - Any static hosting
echo.
echo 🚀 Next steps:
echo   1. cd dist
echo   2. vercel --prod
echo   3. Test your deployment
echo.
pause