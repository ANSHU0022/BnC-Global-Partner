// Build Configuration for Organized Structure
const fs = require('fs');
const path = require('path');

const config = {
  // Source directories
  frontend: {
    pages: './frontend/pages',
    styles: './frontend/styles', 
    assets: './frontend/assets'
  },
  backend: {
    auth: './backend/auth',
    config: './backend/config',
    forms: './backend/forms',
    security: './backend/security'
  },
  appsScript: {
    main: './apps-script/main',
    admin: './apps-script/admin',
    partner: './apps-script/partner',
    utils: './apps-script/utils'
  },
  
  // Build output
  output: './dist',
  
  // File mappings for build
  fileMappings: {
    // Copy HTML pages to root of dist
    'frontend/pages/index.html': 'index.html',
    'frontend/pages/login.html': 'login.html',
    'frontend/pages/admin-dashboard.html': 'admin-dashboard.html',
    'frontend/pages/partner-dashboard.html': 'partner-dashboard.html',
    
    // Copy backend files to js folder
    'backend/auth/auth-system.js': 'js/auth-system.js',
    'backend/config/config.js': 'js/config.js',
    'backend/forms/partner-form.js': 'js/partner-form.js',
    'backend/security/security.js': 'js/security.js',
    
    // Copy styles
    'frontend/styles/styles.css': 'css/styles.css',
    'frontend/assets/script.js': 'js/script.js'
  }
};

module.exports = config;