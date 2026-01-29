@echo off
echo Preparing BnC Partner Portal for Vercel deployment with backend...

REM Install dependencies
echo Installing dependencies...
npm install

REM Build the project
echo Building project...
npm run build

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Deploy to Vercel
echo Deploying to Vercel...
vercel --prod

echo.
echo ✅ Deployment completed!
echo.
echo Your BnC Partner Portal is now live with:
echo - Frontend: Static HTML/CSS/JS
echo - Backend: Serverless API functions
echo - Database: Ready for integration
echo.
echo API Endpoints available:
echo - /api/auth - Authentication
echo - /api/partner-form - Partner registration
echo - /api/admin - Admin operations
echo - /api/config - Configuration
echo.
echo Next steps:
echo 1. Update Google Apps Script URLs
echo 2. Configure environment variables
echo 3. Test all functionality
echo.
pause