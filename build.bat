@echo off
echo Building BnC Partner Portal...

echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Build completed!
echo.
echo To deploy to Vercel:
echo 1. Run: vercel --prod
echo 2. Or push to GitHub and connect to Vercel
echo.
pause