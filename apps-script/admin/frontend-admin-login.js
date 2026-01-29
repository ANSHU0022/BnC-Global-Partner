// Replace your admin login function with this
function handleAdminLogin(event) {
    event.preventDefault();
    
    const profileId = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    fetch('https://script.google.com/macros/s/AKfycbymodi_GSgbmRsZ8WKq8Hu9cqYsASY4dtgbN9-6uZYGEPvI9_lsNTs9mWFz0AP2xkOb/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'adminLogin',
            profileId: profileId,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Admin login successful!');
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
    });
}