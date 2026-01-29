// Security utilities for BnC Partner Portal
class SecurityManager {
    constructor() {
        this.initCSRFProtection();
        this.initInputSanitization();
        this.initRateLimiting();
    }

    // CSRF Protection
    initCSRFProtection() {
        this.csrfToken = this.generateCSRFToken();
        sessionStorage.setItem('csrf_token', this.csrfToken);
    }

    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    validateCSRFToken(token) {
        return token === sessionStorage.getItem('csrf_token');
    }

    // Input Sanitization
    initInputSanitization() {
        this.dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        let sanitized = input;
        this.dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        
        return sanitized.trim();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    validateProfileId(profileId) {
        const profileRegex = /^[A-Z0-9]{6,12}$/;
        return profileRegex.test(profileId);
    }

    // Rate Limiting
    initRateLimiting() {
        this.requestCounts = new Map();
        this.maxRequests = 10;
        this.timeWindow = 60000; // 1 minute
    }

    checkRateLimit(action) {
        const now = Date.now();
        const key = `${action}_${now - (now % this.timeWindow)}`;
        
        const count = this.requestCounts.get(key) || 0;
        if (count >= this.maxRequests) {
            return false;
        }
        
        this.requestCounts.set(key, count + 1);
        return true;
    }

    // Session Security
    validateSession() {
        const user = partnerAuth.getCurrentUser();
        if (!user) return false;
        
        const sessionStart = localStorage.getItem('session_start');
        const maxSessionTime = 8 * 60 * 60 * 1000; // 8 hours
        
        if (!sessionStart || (Date.now() - parseInt(sessionStart)) > maxSessionTime) {
            partnerAuth.logout();
            return false;
        }
        
        return true;
    }

    // Secure API Calls
    secureApiCall(url, data, callback) {
        if (!this.checkRateLimit('api_call')) {
            alert('Too many requests. Please wait a moment.');
            return;
        }

        // Add CSRF token
        data.csrf_token = this.csrfToken;
        
        // Sanitize all string inputs
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
                data[key] = this.sanitizeInput(data[key]);
            }
        });

        const callbackName = 'secureCallback' + Date.now();
        
        window[callbackName] = function(result) {
            // Validate response
            if (result && typeof result === 'object') {
                callback(result);
            } else {
                console.error('Invalid API response');
            }
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };

        const params = new URLSearchParams({...data, callback: callbackName});
        const script = document.createElement('script');
        script.src = `${url}?${params}`;
        script.onerror = function() {
            console.error('API call failed');
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };
        
        document.head.appendChild(script);
    }

    // Content Security
    preventClickjacking() {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
    }

    // Initialize all security measures
    init() {
        this.preventClickjacking();
        
        // Disable right-click context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', e => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
            }
        });

        // Clear sensitive data on page unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.removeItem('csrf_token');
        });
    }
}

// Initialize security manager
const securityManager = new SecurityManager();
securityManager.init();

// Export for use in other files
window.securityManager = securityManager;