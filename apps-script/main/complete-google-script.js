// Complete Google Apps Script Code - Paste this entire code

function doGet(e) {
  // Handle JSONP requests
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  if (action === 'adminLogin') {
    const result = handleAdminLogin({
      profileId: e.parameter.profileId,
      password: e.parameter.password
    });
    
    const jsonResult = JSON.parse(result.getContent());
    const jsonpResponse = `${callback}(${JSON.stringify(jsonResult)})`;
    
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  if (action === 'getAllPartners') {
    const result = getAllPartners();
    const jsonResult = JSON.parse(result.getContent());
    const jsonpResponse = `${callback}(${JSON.stringify(jsonResult)})`;
    
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService
    .createTextOutput('Invalid request')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'adminLogin') {
      return handleAdminLogin(data);
    }
    
    if (data.action === 'login') {
      return handleLogin(data);
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

function handleAdminLogin(data) {
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const adminSheet = spreadsheet.getSheetByName('Admin');
  
  const adminData = adminSheet.getDataRange().getValues();
  const headers = adminData[0];
  
  const adminIdCol = headers.indexOf('Admin Id');
  const passwordCol = headers.indexOf('Password');
  
  for (let i = 1; i < adminData.length; i++) {
    const row = adminData[i];
    
    if (row[adminIdCol] === data.profileId && row[passwordCol] === data.password) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          user: {
            profileId: row[adminIdCol],
            role: 'admin'
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid Admin ID or Password'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleLogin(data) {
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const sheet = spreadsheet.getActiveSheet();
  
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  
  const profileIdCol = headers.indexOf('Profile ID');
  const passwordCol = headers.indexOf('Password');
  
  for (let i = 1; i < allData.length; i++) {
    const row = allData[i];
    
    if (row[profileIdCol] === data.profileId && row[passwordCol] === data.password) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          user: {
            profileId: row[profileIdCol],
            role: 'partner'
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid Profile ID or Password'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllPartners() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
    
    // Try to find the partner data sheet (not Admin sheet)
    const sheets = spreadsheet.getSheets();
    const partnerSheet = sheets.find(s => s.getName() !== 'Admin') || sheets[0];
    
    const allData = partnerSheet.getDataRange().getValues();
    
    if (allData.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          partners: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = allData[0];
    const partners = [];
    
    // Find column indices
    const profileIdCol = headers.findIndex(h => h.toString().toLowerCase().includes('profile'));
    const emailCol = headers.findIndex(h => h.toString().toLowerCase().includes('email'));
    const phoneCol = headers.findIndex(h => h.toString().toLowerCase().includes('phone'));
    const firstNameCol = headers.findIndex(h => h.toString().toLowerCase().includes('first'));
    const lastNameCol = headers.findIndex(h => h.toString().toLowerCase().includes('last'));
    const countryCol = headers.findIndex(h => h.toString().toLowerCase().includes('country'));
    const cityCol = headers.findIndex(h => h.toString().toLowerCase().includes('city'));
    const statusCol = headers.findIndex(h => h.toString().toLowerCase().includes('status'));
    const timestampCol = headers.findIndex(h => h.toString().toLowerCase().includes('timestamp'));
    
    // Process each row (skip header)
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      
      if (row[profileIdCol]) { // Only include rows with Profile ID
        partners.push({
          profileId: row[profileIdCol] || '',
          email: row[emailCol] || '',
          phone: row[phoneCol] || '',
          firstName: row[firstNameCol] || '',
          lastName: row[lastNameCol] || '',
          country: row[countryCol] || '',
          city: row[cityCol] || '',
          status: row[statusCol] || 'New',
          timestamp: row[timestampCol] || ''
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        partners: partners
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Error fetching partners: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleFormSubmission(data) {
  const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
  const sheet = spreadsheet.getActiveSheet();
  
  const row = [
    new Date(data.timestamp),
    data.profileId,
    data.email,
    data.password,
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

// Test function to debug
function testGetAllPartners() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
    
    // Log all sheet names
    const sheets = spreadsheet.getSheets();
    console.log('All sheets:', sheets.map(s => s.getName()));
    
    // Find partner sheet (not Admin)
    const partnerSheet = sheets.find(s => s.getName() !== 'Admin') || sheets[0];
    console.log('Using sheet:', partnerSheet.getName());
    
    // Get data
    const allData = partnerSheet.getDataRange().getValues();
    console.log('Total rows:', allData.length);
    console.log('Headers:', allData[0]);
    
    // Log first few data rows
    for (let i = 1; i < Math.min(5, allData.length); i++) {
      console.log('Row', i, ':', allData[i]);
    }
    
    return getAllPartners();
    
  } catch (error) {
    console.error('Test error:', error);
    return error.toString();
  }
}