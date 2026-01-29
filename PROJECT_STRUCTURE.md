# BnC Global Partner Portal - Project Structure

## 📁 Organized Folder Structure

```
BnC Partner/
├── 📁 frontend/                    # Frontend code and assets
│   ├── 📁 pages/                   # HTML pages
│   │   ├── index.html              # Main landing page
│   │   ├── login.html              # Login page
│   │   ├── admin-dashboard.html    # Admin dashboard
│   │   └── partner-dashboard.html  # Partner dashboard
│   ├── 📁 styles/                  # CSS files
│   │   └── styles.css              # Main stylesheet
│   └── 📁 assets/                  # JavaScript assets
│       └── script.js               # General frontend scripts
│
├── 📁 backend/                     # Backend JavaScript code
│   ├── 📁 auth/                    # Authentication system
│   │   └── auth-system.js          # Authentication logic
│   ├── 📁 config/                  # Configuration files
│   │   └── config.js               # Environment configuration
│   ├── 📁 forms/                   # Form handling
│   │   └── partner-form.js         # Partner form logic
│   └── 📁 security/                # Security utilities
│       └── security.js             # Security functions
│
├── 📁 apps-script/                 # Google Apps Script files
│   ├── 📁 main/                    # Main script files
│   │   ├── complete-google-script.js
│   │   ├── final-google-script.js
│   │   ├── google-apps-script.js
│   │   └── simple-google-script.js
│   ├── 📁 admin/                   # Admin-related scripts
│   │   ├── admin-login.js
│   │   ├── admin-login-frontend.js
│   │   ├── cors-fix-admin-login.js
│   │   └── frontend-admin-login.js
│   ├── 📁 partner/                 # Partner-related scripts
│   │   ├── partner-service-script.js
│   │   └── debug-partner-submission.js
│   └── 📁 utils/                   # Utility and debug scripts
│       ├── cors-google-script.js
│       ├── debug-script.js
│       ├── add-check-function.js
│       ├── fix-doget-function.js
│       ├── fixed-doget.js
│       ├── minimal-fixes.js
│       ├── updated-doget.js
│       └── updated-google-script-cors.js
│
├── 📁 src/                         # Source files for build
│   ├── input.css                   # Tailwind CSS input
│   └── main.ts                     # TypeScript main file
│
├── 📁 public/                      # Public assets
│   └── .gitkeep                    # Keep folder in git
│
├── 📁 admin/                       # Admin-specific files
│
├── 📄 Configuration Files
├── package.json                    # Dependencies
├── package-lock.json              # Lock file
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment config
├── .gitignore                      # Git ignore rules
│
├── 📄 Documentation
├── README.md                       # Main documentation
├── DEPLOYMENT_GUIDE.md            # Deployment instructions
├── setup-instructions.md          # Setup guide
├── partner-service-setup.md       # Partner service setup
├── quick-fix-guide.md             # Quick fixes
├── FILES-TO-REMOVE.md             # Cleanup guide
│
├── 📄 Build & Deploy Scripts
├── build.js                       # Build script
├── build.bat                      # Windows build script
├── deploy.bat                     # Windows deploy script
│
└── 📄 Test Files
    ├── simple-test-url.txt        # Test URLs
    └── test-urls.txt               # Additional test URLs
```

## 🎯 Folder Purpose

### 📁 Frontend
- **pages/**: All HTML pages for the user interface
- **styles/**: CSS files and stylesheets
- **assets/**: JavaScript files for frontend functionality

### 📁 Backend
- **auth/**: Authentication and login systems
- **config/**: Configuration and environment settings
- **forms/**: Form handling and validation logic
- **security/**: Security utilities and protection functions

### 📁 Apps-Script
- **main/**: Primary Google Apps Script files for deployment
- **admin/**: Admin dashboard and management scripts
- **partner/**: Partner-specific functionality scripts
- **utils/**: Utility functions, debugging, and helper scripts

## 🚀 Development Workflow

1. **Frontend Development**: Work in `frontend/` folder
2. **Backend Logic**: Develop in `backend/` folder
3. **Google Apps Script**: Deploy from `apps-script/main/` folder
4. **Testing**: Use scripts from `apps-script/utils/` for debugging

## 📝 File References

When updating file paths in your code, use these new locations:
- HTML pages: `frontend/pages/`
- CSS files: `frontend/styles/`
- Backend JS: `backend/[category]/`
- Apps Script: `apps-script/[category]/`

## 🔧 Build Process

The build process will need to be updated to reference the new folder structure:
- Source files remain in `src/`
- Output goes to `dist/` (as before)
- Reference files from organized folders during build