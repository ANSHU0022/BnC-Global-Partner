// Environment Configuration
const ENV_CONFIG = {
    development: {
        API_URL: 'https://script.google.com/macros/s/AKfycbwC1fvd5mHB_05kYaibR2JPxBFpzwFw-8n-bBFlL0ms8aYPjJS85QIpwLGPQQzKGldZ/exec',
        DEBUG: true,
        SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
        RATE_LIMIT: 10,
        ENABLE_CONSOLE: true
    },
    production: {
        API_URL: 'https://script.google.com/macros/s/AKfycbwC1fvd5mHB_05kYaibR2JPxBFpzwFw-8n-bBFlL0ms8aYPjJS85QIpwLGPQQzKGldZ/exec',
        DEBUG: false,
        SESSION_TIMEOUT: 4 * 60 * 60 * 1000, // 4 hours
        RATE_LIMIT: 5,
        ENABLE_CONSOLE: false
    }
};

// Detect environment
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1' &&
                    !window.location.hostname.includes('localhost') &&
                    !window.location.hostname.includes('192.168');

const CONFIG = isProduction ? ENV_CONFIG.production : ENV_CONFIG.development;

// Disable console in production
if (CONFIG.DEBUG === false) {
    const noop = () => {};
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
        console[method] = noop;
    });
}

// Export configuration
window.APP_CONFIG = CONFIG;

// Debug info
if (CONFIG.DEBUG) {
    console.log('Environment:', isProduction ? 'Production' : 'Development');
    console.log('Config loaded:', CONFIG);
}