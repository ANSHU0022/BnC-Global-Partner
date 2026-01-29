// Add this test function to your Google Apps Script to debug

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