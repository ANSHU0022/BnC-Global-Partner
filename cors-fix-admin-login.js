// Fix for CORS issue - Admin Login Handler
function handleAdminLogin(event) {
    event.preventDefault();
    
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;
    
    if (!adminUsername || !adminPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = document.querySelector('.admin-login-btn');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Create form data for CORS compatibility
    const formData = new FormData();
    formData.append('action', 'adminLogin');
    formData.append('profileId', adminUsername);
    formData.append('password', adminPassword);
    
    // Use fetch with no-cors mode
    fetch('YOUR_GOOGLE_SCRIPT_URL', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        // Since no-cors doesn't return response, assume success
        // You'll need to verify credentials on the backend
        showMessage('Admin login request sent!', 'success');
        
        // Store admin session (temporary)
        localStorage.setItem('adminUser', JSON.stringify({
            profileId: adminUsername,
            role: 'admin'
        }));
        
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Admin login failed: Network error', 'error');
    })
    .finally(() => {
        submitBtn.textContent = 'Login as Admin';
        submitBtn.disabled = false;
    });
}

// Alternative: Use JSONP approach
function handleAdminLoginJSONP(event) {
    event.preventDefault();
    
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;
    
    // Create callback function
    window.adminLoginCallback = function(data) {
        if (data.status === 'success') {
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            showMessage('Admin login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Admin login failed', 'error');
        }
    };
    
    // Create script tag for JSONP
    const script = document.createElement('script');
    const params = new URLSearchParams({
        action: 'adminLogin',
        profileId: adminUsername,
        password: adminPassword,
        callback: 'adminLoginCallback'
    });
    
    script.src = `YOUR_GOOGLE_SCRIPT_URL?${params.toString()}`;
    document.head.appendChild(script);
    
    // Clean up
    script.onload = () => document.head.removeChild(script);
}