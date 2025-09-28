const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { GOOGLE_KEY_FILE, GOOGLE_SPREADSHEET_ID, GOOGLE_USERS_SHEET_NAME } = require('../config');

// Function to get Google Sheets client
async function getSheetsClient() {
  const keyFilePath = path.join(__dirname, '..', 'goggle_apis', 'service-account-k.json');
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`Service account key file not found at ${keyFilePath}`);
  }
  
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

async function verifyUserEmail(email) {
  try {
    const sheets = await getSheetsClient();
    
    // First, find the user by email
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${GOOGLE_USERS_SHEET_NAME}!A:Z`,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    
    // Find the user's row
    const emailColumn = 3; // Column D (0-based index 3) for email/username
    const verificationColumn = 23; // Column X (0-based index 23) for isEmailVerified
    
    let userRow = null;
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
      if (rows[i][emailColumn] === email) {
        userRow = i;
        break;
      }
    }
    
    if (userRow === null) {
      console.log(`User with email ${email} not found.`);
      return;
    }
    
    // Update the verification status
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${GOOGLE_USERS_SHEET_NAME}!X${userRow + 1}`, // +1 because sheets are 1-indexed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[true]]
      },
    });
    
    console.log(`Email ${email} has been verified successfully.`);
  } catch (error) {
    console.error('Error verifying email:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as an argument.');
  process.exit(1);
}

verifyUserEmail(email);
