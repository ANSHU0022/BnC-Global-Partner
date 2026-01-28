# Partner Service Google Sheets Integration Setup

## Step 1: Update Google Apps Script

1. Open your Google Apps Script project
2. Copy the code from `partner-service-script.js` 
3. Add it to your existing `doPost` function or create a new one
4. Replace `YOUR_SPREADSHEET_ID` with your actual Google Sheets ID

## Step 2: Deploy Google Apps Script

1. Click "Deploy" → "New Deployment"
2. Choose "Web app" as type
3. Set execute as "Me" 
4. Set access to "Anyone"
5. Click "Deploy"
6. Copy the web app URL

## Step 3: Update Frontend

1. Open `partner-dashboard.html`
2. Find line with `YOUR_GOOGLE_APPS_SCRIPT_URL`
3. Replace it with your actual Google Apps Script web app URL

## Step 4: Test Integration

1. Open partner dashboard
2. Click "Start AI Interview"
3. Complete the form
4. Check your "Partner Service" sheet for new data

## Data Mapping

- **Timestamp**: Auto-generated submission time
- **Profile ID**: From logged-in user session  
- **Partner Type**: Question 1 answer
- **Service Type**: Question 2 answers (comma-separated)
- **Connect Time**: Question 3 date + time combined

## Troubleshooting

- Ensure "Partner Service" sheet exists in your Google Sheets
- Check Google Apps Script execution permissions
- Verify CORS settings in script
- Check browser console for errors

## Example Data Row

```
2024-01-15 10:30:25 | P001 | Service Provider | Cyber Security, Data Privacy | 2024-01-20 at 14:00
```