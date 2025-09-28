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

async function listUsers() {
  try {
    const sheets = await getSheetsClient();
    
    // Get all user data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${GOOGLE_USERS_SHEET_NAME}!A:Z`,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    
    // Print header
    console.log('Email (Column D)\tVerified (Column X)');
    console.log('-----------------------------------');
    
    // Print each user's email and verification status
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
      const email = rows[i][3]; // Column D (0-based index 3)
      const isVerified = rows[i][23] || false; // Column X (0-based index 23)
      console.log(`${email}\t${isVerified}`);
    }
    
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

listUsers();
