// Add this to your existing login JavaScript

function handleAdminLogin(event) {
    event.preventDefault();
    
    const profileId = document.getElementById('profileId').value;
    const password = document.getElementById('password').value;
    
    if (!profileId || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = document.querySelector('.login-btn');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Send admin login request
    fetch('YOUR_GOOGLE_SCRIPT_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'adminLogin',  // Changed to adminLogin
            profileId: profileId,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Store admin session
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            showMessage('Admin login successful!', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Admin login failed', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Admin login failed: ' + error.message, 'error');
    })
    .finally(() => {
        submitBtn.textContent = 'Login as Admin';
        submitBtn.disabled = false;
    });
}

// Update your existing login form to detect admin login
function detectLoginType() {
    const profileId = document.getElementById('profileId').value;
    
    // If admin login is detected, use admin login function
    if (profileId.toLowerCase().includes('admin')) {
        return handleAdminLogin;
    }
    
    // Otherwise use regular partner login
    return handlePartnerLogin;
}