// Partner Authentication System
class PartnerAuth {
    constructor() {
        this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUsXHHbuLZLqwF_VcvWgKITClYWK7r44yBjoZ6-cEckBc9l-j4dfijyOe3GVNsq1_k/exec';
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkSession();
        this.setupEventListeners();
    }

    // Partner login
    async loginPartner(profileId, password) {
        try {
            console.log('Attempting login with:', profileId, password);
            
            // Use Google Sheets API via public CSV export to bypass CORS
            const SHEET_ID = '1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA';
            const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
            
            try {
                const response = await fetch(CSV_URL);
                const csvText = await response.text();
                
                // Parse CSV data
                const rows = csvText.split('\n').map(row => row.split(','));
                const headers = rows[0];
                
                // Find column indices
                const profileIdIndex = headers.findIndex(h => h.includes('Profile ID'));
                const passwordIndex = headers.findIndex(h => h.includes('Password'));
                const emailIndex = headers.findIndex(h => h.includes('Email'));
                const phoneIndex = headers.findIndex(h => h.includes('Phone'));
                const firstNameIndex = headers.findIndex(h => h.includes('First Name'));
                const lastNameIndex = headers.findIndex(h => h.includes('Last Name'));
                const countryIndex = headers.findIndex(h => h.includes('Country'));
                const cityIndex = headers.findIndex(h => h.includes('City'));
                
                console.log('CSV Headers:', headers);
                console.log('Looking for Profile ID:', profileId, 'at index:', profileIdIndex);
                
                // Search for matching user
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (row[profileIdIndex] === profileId && row[passwordIndex] === password) {
                        const user = {
                            profileId: row[profileIdIndex],
                            email: row[emailIndex] || 'partner@email.com',
                            phone: row[phoneIndex] || '1234567890',
                            firstName: row[firstNameIndex] || profileId.split('#')[0],
                            lastName: row[lastNameIndex] || 'Partner',
                            country: row[countryIndex] || 'Country',
                            city: row[cityIndex] || 'City',
                            status: 'Active'
                        };
                        
                        console.log('Found matching user:', user);
                        
                        this.currentUser = user;
                        this.saveSession(user);
                        return { success: true, user: user };
                    }
                }
                
                return { success: false, error: 'Invalid Profile ID or Password' };
                
            } catch (csvError) {
                console.error('CSV fetch error:', csvError);
                return { success: false, error: 'Unable to verify credentials. Please try again.' };
            }
            
        } catch (error) {
            console.error('Login error details:', error);
            return { success: false, error: `Login failed: ${error.message}` };
        }
    }

    // Admin login using JSONP to bypass CORS
    async loginAdmin(username, password) {
        return new Promise((resolve) => {
            // Create callback function
            const callbackName = 'adminLoginCallback_' + Date.now();
            window[callbackName] = (data) => {
                if (data.status === 'success') {
                    this.currentUser = { ...data.user, isAdmin: true };
                    this.saveSession(this.currentUser);
                    resolve({ success: true, user: this.currentUser });
                } else {
                    resolve({ success: false, error: data.message || 'Login failed' });
                }
                // Cleanup
                delete window[callbackName];
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            };
            
            // Create script tag for JSONP
            const script = document.createElement('script');
            const params = new URLSearchParams({
                action: 'adminLogin',
                profileId: username,
                password: password,
                callback: callbackName
            });
            
            script.src = `https://script.google.com/macros/s/AKfycbxd1-LEPTGHZ57KdkRbkjdsdC0jevBaqMVSHCR9GWKsqe_dBQg_C7x78ixz2endiDqq/exec?${params.toString()}`;
            
            // Handle errors
            script.onerror = () => {
                resolve({ success: false, error: 'Network error. Please check your connection.' });
                delete window[callbackName];
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            };
            
            // Add timeout for better UX
            setTimeout(() => {
                if (window[callbackName]) {
                    resolve({ success: false, error: 'Request timeout. Please try again.' });
                    delete window[callbackName];
                    if (document.head.contains(script)) {
                        document.head.removeChild(script);
                    }
                }
            }, 10000); // 10 second timeout
            
            document.head.appendChild(script);
        });
    }

    // Save session
    saveSession(user) {
        localStorage.setItem('bnc_partner_session', JSON.stringify({
            user: user,
            timestamp: Date.now()
        }));
    }

    // Check existing session
    checkSession() {
        const session = localStorage.getItem('bnc_partner_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                this.currentUser = sessionData.user;
                return true;
            } else {
                this.logout();
            }
        }
        return false;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('bnc_partner_session');
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Setup event listeners
    setupEventListeners() {
        const loginForm = document.getElementById('partner-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const adminLoginForm = document.getElementById('admin-login-form');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }
    }

    // Handle partner login
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileId = formData.get('profileId');
        const password = formData.get('password');

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';

        const result = await this.loginPartner(profileId, password);
        
        if (result.success) {
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
            setTimeout(() => {
                window.location.href = 'partner-dashboard.html';
            }, 1000);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert(`Login failed: ${result.error}`);
        }
    }

    // Handle admin login
    async handleAdminLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';

        const result = await this.loginAdmin(username, password);
        
        if (result.success) {
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert(`Admin login failed: ${result.error}`);
        }
    }
}

// Initialize authentication system
const partnerAuth = new PartnerAuth();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PartnerAuth;
}