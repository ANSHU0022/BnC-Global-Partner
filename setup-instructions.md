# Partner Form Google Sheets Integration Setup

## Files Created:
1. `partner-form.js` - Frontend form handler
2. `google-apps-script.js` - Backend Google Apps Script code
3. `setup-instructions.md` - This file

## Setup Instructions:

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project with name "BnC Partner Form Handler"

### Step 2: Configure the Script
1. In the script editor, update the notification email:
   ```javascript
   const NOTIFICATION_EMAIL = 'your-email@gmail.com';
   ```

2. Optionally, add your email as editor to the spreadsheet:
   ```javascript
   spreadsheet.addEditor('your-email@gmail.com');
   ```

### Step 3: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. Description: "Partner Form Handler"
4. Execute as: "Me"
5. Who has access: "Anyone"
6. Click "Deploy"
7. Copy the Web App URL

### Step 4: Update Frontend Code
1. Open `partner-form.js`
2. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your Web App URL:
   ```javascript
   this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### Step 5: Test the Setup
1. In Google Apps Script, run the `testSetup()` function
2. Check if a new spreadsheet "BnC Global Partner Applications" is created
3. Verify the headers and test data are added correctly

## Google Sheet Structure:
The script will automatically create a spreadsheet with these columns:
- Timestamp
- Company Name
- Contact Person
- Email
- Phone
- Partnership Type
- Experience
- Revenue Range
- Business Description
- Website
- Terms Accepted
- Source
- Status

## Features:
- ✅ Automatic spreadsheet creation
- ✅ Header formatting with company colors
- ✅ Email notifications for new submissions
- ✅ Form validation (email, phone, required fields)
- ✅ Success/error messages
- ✅ Multi-step form with progress tracking
- ✅ Responsive design
- ✅ Data sanitization and formatting

## Security Notes:
- The Web App is set to "Anyone" access for form submissions
- No sensitive data is logged in the frontend
- All form data is validated before submission
- Email notifications help track submissions

## Troubleshooting:
1. **Form not submitting**: Check the Web App URL in `partner-form.js`
2. **No email notifications**: Verify the email address in Google Apps Script
3. **Spreadsheet not created**: Run `testSetup()` function in Apps Script
4. **CORS errors**: Ensure Web App is deployed with "Anyone" access

## Customization:
- Modify form fields in `index.html`
- Update validation rules in `partner-form.js`
- Change spreadsheet structure in `google-apps-script.js`
- Customize email templates in the `sendEmailNotification()` function