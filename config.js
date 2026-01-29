// Configuration for Vercel deployment
const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.origin + '/api',
    
    // Environment detection
    ENVIRONMENT: window.location.hostname.includes('localhost') ? 'development' : 'production',
    
    // API Endpoints
    ENDPOINTS: {
        AUTH: '/api/auth',
        PARTNER_FORM: '/api/partner-form',
        ADMIN: '/api/admin',
        CONFIG: '/api/config'
    },
    
    // Security settings
    SECURITY: {
        CSRF_TOKEN_NAME: 'bnc_csrf_token',
        SESSION_STORAGE_KEY: 'bnc_partner_session',
        ADMIN_SESSION_KEY: 'bnc_admin_session'
    },
    
    // Form validation
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 6,
        MIN_PHONE_LENGTH: 12,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    
    // Rate limiting
    RATE_LIMIT: {
        MAX_ATTEMPTS: 5,
        LOCKOUT_TIME: 15 * 60 * 1000 // 15 minutes
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}