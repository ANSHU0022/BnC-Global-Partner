// CHANGE 1: Replace this line in your doGet function (around line 11):
// FROM:
if (action === 'submitPartnerService') {
  return submitPartnerService(e);
}

// TO:
if (action === 'submitPartnerService') {
  const result = submitPartnerService(e);
  if (callback) {
    const jsonResult = JSON.parse(result.getContent());
    const jsonpResponse = `${callback}(${JSON.stringify(jsonResult)})`;
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return result;
}

// CHANGE 2: Replace your submitPartnerService function (at the bottom) with this:
function submitPartnerService(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
    let sheet = spreadsheet.getSheetByName('Partner Service');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Partner Service');
      sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Profile ID', 'Partner Type', 'Service Type', 'Connect Time']]);
    }
    
    const serviceTypes = e.parameter.services || '';
    const connectTime = `${e.parameter.meetingDate || ''} at ${e.parameter.meetingTime || ''}`;
    
    const rowData = [
      new Date(),
      e.parameter.profileId || '',
      e.parameter.partnerType || '',
      serviceTypes,
      connectTime
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Partner service data submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}