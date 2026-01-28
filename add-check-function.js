// ADD THIS FUNCTION TO YOUR GOOGLE APPS SCRIPT (after your existing functions)

function checkAIProfile(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1nnOO-pTVVG1a004oT0Scrw8KUCYfyReRovDnw9ySTmA');
    const sheet = spreadsheet.getSheetByName('Partner Service');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        hasProfile: false
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const profileIdCol = headers.indexOf('Profile ID');
    
    // Check if this profile ID already exists
    for (let i = 1; i < data.length; i++) {
      if (data[i][profileIdCol] === e.parameter.profileId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          hasProfile: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      hasProfile: false
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}