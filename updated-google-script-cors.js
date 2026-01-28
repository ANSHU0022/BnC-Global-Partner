// Updated Google Apps Script with JSONP support

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
  
  return ContentService
    .createTextOutput('Invalid request')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    let data;
    
    // Handle both JSON and form data
    if (e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // Handle form data
      data = {
        action: e.parameter.action,
        profileId: e.parameter.profileId,
        password: e.parameter.password
      };
    }
    
    if (data.action === 'login') {
      return handleLogin(data);
    }
    
    if (data.action === 'adminLogin') {
      return handleAdminLogin(data);
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
  try {
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
    
    const adminData = adminSheet.getDataRange().getValues();
    const headers = adminData[0];
    
    const adminIdCol = headers.indexOf('Admin Id');
    const passwordCol = headers.indexOf('Password');
    
    // Search for admin
    for (let i = 1; i < adminData.length; i++) {
      const row = adminData[i];
      
      if (row[adminIdCol] === data.profileId && row[passwordCol] === data.password) {
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
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid Admin ID or Password'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}