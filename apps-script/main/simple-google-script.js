// Simplified Google Apps Script for Partner Login
// Replace your existing code with this

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'login') {
      return handleLogin(data);
    }
    
    if (data.action === 'adminLogin') {
      return handleAdminLogin(data);
    }
    
    // Handle form submission (existing)
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

function handleLogin(data) {
  // Get the spreadsheet
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const sheet = spreadsheet.getActiveSheet();
  
  // Get all data
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  
  // Find column indices
  const profileIdCol = headers.indexOf('Profile ID');
  const passwordCol = headers.indexOf('Password');
  const emailCol = headers.indexOf('Email');
  const phoneCol = headers.indexOf('Phone');
  const firstNameCol = headers.indexOf('First Name');
  const lastNameCol = headers.indexOf('Last Name');
  const countryCol = headers.indexOf('Country');
  const cityCol = headers.indexOf('City');
  
  // Search for user (skip header row)
  for (let i = 1; i < allData.length; i++) {
    const row = allData[i];
    
    if (row[profileIdCol] === data.profileId && row[passwordCol] === data.password) {
      // Found matching user
      const user = {
        profileId: row[profileIdCol],
        email: row[emailCol],
        phone: row[phoneCol],
        firstName: row[firstNameCol],
        lastName: row[lastNameCol],
        country: row[countryCol],
        city: row[cityCol],
        status: 'Active'
      };
      
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          user: user
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // User not found
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid Profile ID or Password'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminLogin(data) {
  // Get the spreadsheet and Admin sheet
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const adminSheet = spreadsheet.getSheetByName('Admin');
  
  if (!adminSheet) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Admin sheet not found'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Get all admin data
  const adminData = adminSheet.getDataRange().getValues();
  const headers = adminData[0];
  
  // Find column indices
  const adminIdCol = headers.indexOf('Admin Id');
  const passwordCol = headers.indexOf('Password');
  
  // Search for admin (skip header row)
  for (let i = 1; i < adminData.length; i++) {
    const row = adminData[i];
    
    if (row[adminIdCol] === data.profileId && row[passwordCol] === data.password) {
      // Found matching admin
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          user: {
            profileId: row[adminIdCol],
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User'
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Admin not found
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid Admin ID or Password'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleFormSubmission(data) {
  // Your existing form handling code
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const sheet = spreadsheet.getActiveSheet();
  
  const row = [
    new Date(data.timestamp),
    data.profileId,
    data.email,
    data.password || data.idNumber,
    data.phone,
    data.firstName,
    data.lastName,
    data.country,
    data.city,
    data.terms,
    data.source,
    'New'
  ];
  
  sheet.appendRow(row);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}