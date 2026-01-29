# BnC Partner Portal - Deployment Fix Guide

## Issues Fixed ✅

1. **JavaScript files not loading (404 errors)**
   - Moved all JS files to `/public` directory
   - Updated all HTML files to use absolute paths (`/config.js` instead of `config.js`)
   - Fixed Vite configuration for proper static file serving

2. **Build process issues**
   - Created custom build script (`build.js`) to handle file copying
   - Simplified package.json dependencies
   - Fixed vercel.json routing configuration

## Quick Deployment Steps

### Method 1: Direct Upload to Vercel
1. Run the build command:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder contents to Vercel:
   - Go to vercel.com
   - Create new project
   - Upload the `dist` folder
   - Deploy

### Method 2: Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   cd dist
   vercel --prod
   ```

### Method 3: GitHub Integration
1. Push your code to GitHub
2. Connect the repository to Vercel
3. Vercel will automatically build and deploy

## Files Structure After Fix

```
BnC Partner/
├── dist/                    # Built files (ready for deployment)
│   ├── index.html
│   ├── login.html
│   ├── partner-dashboard.html
│   ├── admin-dashboard.html
│   ├── config.js
│   ├── security.js
│   ├── auth-system.js
│   ├── partner-form.js
│   └── vercel.json
├── public/                  # Static assets
│   ├── config.js
│   ├── security.js
│   ├── auth-system.js
│   └── partner-form.js
├── build.js                 # Custom build script
├── package.json
├── vite.config.js
└── vercel.json
```

## What Was Changed

### 1. Script Paths in HTML Files
**Before:**
```html
<script src="config.js"></script>
<script src="security.js"></script>
```

**After:**
```html
<script src="/config.js"></script>
<script src="/security.js"></script>
```

### 2. File Organization
- Moved all JavaScript files to `/public` directory
- This ensures they're served as static assets by Vercel

### 3. Build Process
- Created custom `build.js` script
- Copies all necessary files to `dist` directory
- Handles static file serving properly

### 4. Vercel Configuration
Updated `vercel.json` with proper routing:
```json
{
  "routes": [
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))$",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Testing Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the dist folder:
   ```bash
   cd dist
   python -m http.server 8000
   ```
   Or use any static file server

3. Open `http://localhost:8000` in your browser

## Troubleshooting

### If JavaScript still doesn't load:
1. Check browser console for 404 errors
2. Verify all script tags use absolute paths (`/filename.js`)
3. Ensure files exist in the `dist` directory after build

### If build fails:
1. Delete `node_modules` and `dist` directories
2. Run `npm install`
3. Run `npm run build`

### If Vercel deployment fails:
1. Make sure you're deploying the `dist` folder contents
2. Check vercel.json is in the root of your deployment
3. Verify all file paths are correct

## Success Indicators

After deployment, you should see:
- ✅ Partner form opens when clicking "Become a Partner"
- ✅ Login functionality works
- ✅ No 404 errors in browser console
- ✅ All buttons and forms are functional

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all files are present in the deployed version
3. Test locally first before deploying

Your BnC Partner Portal should now work perfectly on Vercel! 🎉