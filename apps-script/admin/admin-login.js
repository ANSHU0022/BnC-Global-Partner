// Admin Login Configuration
const ADMIN_CREDENTIALS = {
  profileId: 'ADMIN001',
  password: 'BnCAdmin2024'
};

// Add this to your Google Apps Script
function handleAdminLogin(data) {
  // Check hardcoded admin credentials
  if (data.profileId === ADMIN_CREDENTIALS.profileId && 
      data.password === ADMIN_CREDENTIALS.password) {
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        user: {
          profileId: 'ADMIN001',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@bncglobal.in'
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // If not admin, check regular users
  return handleLogin(data);
}

// Update your doPost function
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'login') {
      return handleAdminLogin(data); // Use admin login instead
    }
    
    return handleFormSubmission(data);
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}