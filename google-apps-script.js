// Google Apps Script Code for Partner Authentication System
// Deploy this as a Web App in Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action) {
      // Handle authentication actions
      switch(data.action) {
        case 'login':
          return handleLogin(data);
        case 'adminLogin':
          return handleAdminLogin(data);
        default:
          throw new Error('Invalid action');
      }
    } else {
      // Handle form submission (existing functionality)
      return handleFormSubmission(data);
    }
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleFormSubmission(data) {
  const spreadsheet = getOrCreateSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  setupHeaders(sheet);
  appendFormData(sheet, data);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleLogin(data) {
  const spreadsheet = getOrCreateSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Get all data from sheet
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  
  // Debug: Log the headers and search data
  console.log('Headers:', headers);
  console.log('Looking for Profile ID:', data.profileId);
  console.log('Looking for Password:', data.password);
  
  // Find column indices - matching your exact sheet structure
  const profileIdIndex = headers.indexOf('Profile ID'); // Column B
  const passwordIndex = headers.indexOf('Password'); // Column D
  const emailIndex = headers.indexOf('Email'); // Column C
  const phoneIndex = headers.indexOf('Phone'); // Column E
  const firstNameIndex = headers.indexOf('First Name'); // Column F
  const lastNameIndex = headers.indexOf('Last Name'); // Column G
  const countryIndex = headers.indexOf('Country'); // Column H
  const cityIndex = headers.indexOf('City'); // Column I
  
  console.log('Profile ID Index:', profileIdIndex);
  console.log('Password Index:', passwordIndex);
  
  // Find partner by Profile ID (skip header row)
  const partnerRow = allData.slice(1).find(row => {
    console.log('Checking row Profile ID:', row[profileIdIndex]);
    return row[profileIdIndex] === data.profileId;
  });
  
  if (!partnerRow) {
    console.log('Profile ID not found in sheet');
    throw new Error('Profile ID not found');
  }
  
  console.log('Found partner row:', partnerRow);
  console.log('Password in sheet:', partnerRow[passwordIndex]);
  
  // Check password against Password column
  if (partnerRow[passwordIndex].toString().trim() !== data.password.toString().trim()) {
    console.log('Password mismatch');
    throw new Error('Invalid password');
  }
  
  // Return user data
  const user = {
    profileId: partnerRow[profileIdIndex],
    email: partnerRow[emailIndex],
    phone: partnerRow[phoneIndex],
    firstName: partnerRow[firstNameIndex],
    lastName: partnerRow[lastNameIndex],
    country: partnerRow[countryIndex],
    city: partnerRow[cityIndex],
    status: 'Active'
  };
  
  console.log('Login successful for user:', user);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      user: user
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminLogin(data) {
  const spreadsheet = getOrCreateSpreadsheet();
  const adminSheet = getOrCreateSheet(spreadsheet, 'Admin');
  
  setupAdminHeaders(adminSheet);
  
  const admins = adminSheet.getDataRange().getValues();
  const adminRow = admins.find(row => row[0] === data.username);
  
  if (!adminRow || adminRow[1] !== data.password) {
    throw new Error('Invalid admin credentials');
  }
  
  const user = {
    username: adminRow[0],
    role: adminRow[2] || 'admin'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      user: user
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSpreadsheet() {
  const SPREADSHEET_NAME = 'BnC Global Partner Applications';
  
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    return spreadsheet;
  }
}

function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function setupHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Profile ID',
      'Email',
      'Password',
      'Phone',
      'First Name',
      'Last Name',
      'Country',
      'City',
      'Terms Accepted',
      'Source',
      'Status'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2c5aa0');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    sheet.autoResizeColumns(1, headers.length);
  }
}

function appendFormData(sheet, data) {
  const row = [
    new Date(data.timestamp),
    data.profileId,
    data.email,
    data.password || data.idNumber, // Use password if available, fallback to idNumber
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
  
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow, 1, 1, row.length);
  
  if (lastRow % 2 === 0) {
    range.setBackground('#f8f9fa');
  }
  
  sheet.autoResizeColumns(1, row.length);
}

function setupAdminHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = ['Username', 'Password', 'Role'];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Add default admin
    sheet.appendRow(['admin', 'admin123', 'super_admin']);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2c5aa0');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    sheet.autoResizeColumns(1, headers.length);
  }
}

// Test function
function testSetup() {
  const spreadsheet = getOrCreateSpreadsheet();
  const partnersSheet = getOrCreateSheet(spreadsheet, 'Partners');
  const adminSheet = getOrCreateSheet(spreadsheet, 'Admin');
  
  setupPartnersHeaders(partnersSheet);
  setupAdminHeaders(adminSheet);
  
  console.log('Setup completed successfully');
  console.log('Spreadsheet URL:', spreadsheet.getUrl());
}