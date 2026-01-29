// CORS-Enabled Google Apps Script for Partner Login
// Replace your existing Google Apps Script code with this

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Handle CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    let data;
    
    if (e.postData) {
      data = JSON.parse(e.postData.contents);
    } else {
      // Handle GET request for testing
      return output.setContent(JSON.stringify({
        status: 'success',
        message: 'Google Apps Script is working!'
      }));
    }
    
    if (data.action === 'login') {
      return handleLogin(data, output);
    }
    
    // Handle form submission (existing)
    return handleFormSubmission(data, output);
    
  } catch (error) {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    return output.setContent(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
  }
}

function handleLogin(data, output) {
  try {
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
        
        return output.setContent(JSON.stringify({
          status: 'success',
          user: user
        }));
      }
    }
    
    // User not found
    return output.setContent(JSON.stringify({
      status: 'error',
      message: 'Invalid Profile ID or Password'
    }));
    
  } catch (error) {
    return output.setContent(JSON.stringify({
      status: 'error',
      message: 'Login error: ' + error.toString()
    }));
  }
}

function handleFormSubmission(data, output) {
  try {
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
    
    return output.setContent(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully'
    }));
    
  } catch (error) {
    return output.setContent(JSON.stringify({
      status: 'error',
      message: 'Form submission error: ' + error.toString()
    }));
  }
}