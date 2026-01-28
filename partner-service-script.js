// Google Apps Script for Partner Service Data
// Copy this code to your Google Apps Script project

function doPost(e) {
  try {
    let data;
    
    // Handle both JSON and form data
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    if (data.action === 'submitPartnerService') {
      return submitPartnerService(data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function submitPartnerService(data) {
  console.log('submitPartnerService called with data:', data);
  
  try {
    const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
    let sheet = spreadsheet.getSheetByName('Partner Service');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('Creating Partner Service sheet');
      sheet = spreadsheet.insertSheet('Partner Service');
      sheet.getRange(1, 1, 1, 5).setValues([[
        'Timestamp', 'Profile ID', 'Partner Type', 'Service Type', 'Connect Time'
      ]]);
    }
    
    // Handle services - could be array or comma-separated string
    let serviceTypes = '';
    if (data.services) {
      if (typeof data.services === 'string') {
        serviceTypes = data.services;
      } else if (Array.isArray(data.services)) {
        serviceTypes = data.services.join(', ');
      }
    }
    
    console.log('Processed services:', serviceTypes);
    
    // Combine date and time
    const connectTime = `${data.meetingDate || ''} at ${data.meetingTime || ''}`;
    console.log('Connect time:', connectTime);
    
    const rowData = [
      new Date(),
      data.profileId || '',
      data.partnerType || '',
      serviceTypes,
      connectTime
    ];
    
    console.log('Row data to append:', rowData);
    
    sheet.appendRow(rowData);
    console.log('Data successfully appended to sheet');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Partner service data submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Error in submitPartnerService:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doGet(e) {
  console.log('GET request received:', e.parameter);
  
  // Handle partner service submission via GET
  if (e.parameter.action === 'submitPartnerService') {
    console.log('Processing partner service submission via GET');
    return submitPartnerService(e.parameter);
  }
  
  // Handle CORS for preflight requests
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}