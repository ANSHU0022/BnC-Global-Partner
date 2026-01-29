// Authentication System for Vercel Deployment
class AuthSystem {
    constructor() {
        this.apiUrl = CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.AUTH;
        this.sessionKey = CONFIG.SECURITY.SESSION_STORAGE_KEY;
        this.adminSessionKey = CONFIG.SECURITY.ADMIN_SESSION_KEY;
    }

    async login(email, password) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email,
                    password
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Store session
                localStorage.setItem(this.sessionKey, JSON.stringify({
                    token: result.token,
                    email: email,
                    timestamp: Date.now()
                }));
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async adminLogin(email, password) {
        try {
            const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.ADMIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'admin-login',
                    email,
                    password
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Store admin session
                localStorage.setItem(this.adminSessionKey, JSON.stringify({
                    token: result.token,
                    email: email,
                    role: result.role,
                    timestamp: Date.now()
                }));
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Admin login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    isLoggedIn() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            const sessionData = JSON.parse(session);
            // Check if session is less than 24 hours old
            return (Date.now() - sessionData.timestamp) < 24 * 60 * 60 * 1000;
        }
        return false;
    }

    isAdminLoggedIn() {
        const session = localStorage.getItem(this.adminSessionKey);
        if (session) {
            const sessionData = JSON.parse(session);
            // Check if session is less than 24 hours old
            return (Date.now() - sessionData.timestamp) < 24 * 60 * 60 * 1000;
        }
        return false;
    }

    getSession() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    getAdminSession() {
        const session = localStorage.getItem(this.adminSessionKey);
        return session ? JSON.parse(session) : null;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
    }

    adminLogout() {
        localStorage.removeItem(this.adminSessionKey);
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
} else {
    window.authSystem = authSystem;
}