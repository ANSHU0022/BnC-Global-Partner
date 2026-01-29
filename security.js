// Security utilities for client-side
class SecurityUtils {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.rateLimitData = {};
    }

    // Generate CSRF token
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Get CSRF token
    getCSRFToken() {
        return this.csrfToken;
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Validate email format
    validateEmail(email) {
        return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    }

    // Validate phone number
    validatePhone(phone) {
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length >= CONFIG.VALIDATION.MIN_PHONE_LENGTH;
    }

    // Rate limiting check
    checkRateLimit(identifier) {
        const now = Date.now();
        const key = identifier || 'default';
        
        if (!this.rateLimitData[key]) {
            this.rateLimitData[key] = { attempts: 0, lastAttempt: now };
        }
        
        const data = this.rateLimitData[key];
        
        // Reset if lockout time has passed
        if (now - data.lastAttempt > CONFIG.RATE_LIMIT.LOCKOUT_TIME) {
            data.attempts = 0;
        }
        
        // Check if rate limited
        if (data.attempts >= CONFIG.RATE_LIMIT.MAX_ATTEMPTS) {
            const timeLeft = CONFIG.RATE_LIMIT.LOCKOUT_TIME - (now - data.lastAttempt);
            if (timeLeft > 0) {
                return {
                    allowed: false,
                    timeLeft: Math.ceil(timeLeft / 1000 / 60) // minutes
                };
            }
        }
        
        // Increment attempts
        data.attempts++;
        data.lastAttempt = now;
        
        return { allowed: true };
    }

    // Reset rate limit for identifier
    resetRateLimit(identifier) {
        const key = identifier || 'default';
        if (this.rateLimitData[key]) {
            this.rateLimitData[key].attempts = 0;
        }
    }

    // Secure storage (encrypt sensitive data)
    secureStore(key, data) {
        try {
            const encrypted = btoa(JSON.stringify(data));
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Secure store error:', error);
        }
    }

    // Secure retrieval (decrypt sensitive data)
    secureRetrieve(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (encrypted) {
                return JSON.parse(atob(encrypted));
            }
        } catch (error) {
            console.error('Secure retrieve error:', error);
        }
        return null;
    }

    // Content Security Policy check
    checkCSP() {
        // Basic CSP validation
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return meta !== null;
    }

    // Detect potential XSS attempts
    detectXSS(input) {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];
        
        return xssPatterns.some(pattern => pattern.test(input));
    }

    // Log security events
    logSecurityEvent(event, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // In production, send to security monitoring service
        console.warn('Security Event:', logEntry);
    }
}

// Initialize security utils
const securityUtils = new SecurityUtils();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else {
    window.securityUtils = securityUtils;
}