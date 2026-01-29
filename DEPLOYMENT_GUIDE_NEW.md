# Deployment Guide - Organized Structure

## 📁 New Project Structure

The project has been reorganized into a clean, maintainable structure:

```
BnC Partner/
├── 📁 frontend/          # All frontend code
├── 📁 backend/           # Backend JavaScript logic  
├── 📁 apps-script/       # Google Apps Script files
├── 📁 src/              # Build source files
└── 📁 dist/             # Build output (generated)
```

## 🚀 Deployment Steps

### 1. Frontend Deployment (Vercel)

**Option A: Direct Upload**
```bash
# Build the project
npm run build

# Upload dist/ folder to Vercel
# The build process will copy files from organized folders to dist/
```

**Option B: Git Integration**
```bash
# Push to GitHub with new structure
git add .
git commit -m "Reorganized project structure"
git push origin main

# Vercel will auto-deploy from the repository
```

### 2. Google Apps Script Deployment

**Main Script (Primary)**
- Use files from `apps-script/main/`
- Deploy `final-google-script.js` or `complete-google-script.js`

**Admin Functions**
- Use files from `apps-script/admin/`
- Deploy admin-specific functions separately if needed

**Partner Functions**  
- Use files from `apps-script/partner/`
- Deploy partner-specific functions

**Utilities**
- Files in `apps-script/utils/` are for debugging and development

### 3. File Path Updates

The HTML files have been updated to reference the new structure:

**Before:**
```html
<script src="/config.js"></script>
<script src="/auth-system.js"></script>
```

**After:**
```html
<script src="../../backend/config/config.js"></script>
<script src="../../backend/auth/auth-system.js"></script>
```

### 4. Build Process

The build process will:
1. Copy HTML files from `frontend/pages/` to `dist/`
2. Copy JS files from `backend/` folders to `dist/js/`
3. Copy CSS files from `frontend/styles/` to `dist/css/`
4. Update file references automatically

### 5. Environment Configuration

Update `backend/config/config.js` with:
- Google Apps Script URLs
- Environment-specific settings
- API endpoints

## 🔧 Development Workflow

### Frontend Development
```bash
# Work in frontend/ folder
cd frontend/pages     # HTML files
cd frontend/styles    # CSS files  
cd frontend/assets    # JS assets
```

### Backend Development
```bash
# Work in backend/ folder
cd backend/auth       # Authentication
cd backend/config     # Configuration
cd backend/forms      # Form handling
cd backend/security   # Security functions
```

### Apps Script Development
```bash
# Work in apps-script/ folder
cd apps-script/main     # Main deployment files
cd apps-script/admin    # Admin functions
cd apps-script/partner  # Partner functions
cd apps-script/utils    # Development utilities
```

## 📝 File References

When updating code, use these paths:

### HTML Pages
- `frontend/pages/index.html`
- `frontend/pages/login.html`
- `frontend/pages/admin-dashboard.html`
- `frontend/pages/partner-dashboard.html`

### Backend Scripts
- `backend/auth/auth-system.js`
- `backend/config/config.js`
- `backend/forms/partner-form.js`
- `backend/security/security.js`

### Apps Script Files
- `apps-script/main/final-google-script.js` (Primary)
- `apps-script/admin/admin-login.js`
- `apps-script/partner/partner-service-script.js`

## ⚠️ Important Notes

1. **File Paths**: All file references have been updated to work with the new structure
2. **Build Output**: The `dist/` folder contains the final deployable files
3. **Apps Script**: Deploy from `apps-script/main/` for production
4. **Development**: Use organized folders for development, build for deployment

## 🔍 Troubleshooting

### Common Issues:

1. **File Not Found Errors**
   - Check file paths in HTML files
   - Ensure build process copied files correctly

2. **Apps Script Errors**
   - Use files from `apps-script/main/` for deployment
   - Check function names and dependencies

3. **Build Issues**
   - Run `npm install` to update dependencies
   - Check `build.config.js` for correct file mappings

## 📞 Support

For issues with the new structure:
1. Check file paths in HTML files
2. Verify build configuration
3. Test locally before deployment