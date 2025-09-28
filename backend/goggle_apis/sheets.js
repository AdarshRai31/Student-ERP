const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { GOOGLE_KEY_FILE, GOOGLE_SPREADSHEET_ID, GOOGLE_USERS_SHEET_NAME, SHEET_NAMES } = require('../config');

// Define the columns for your user data. This helps in accessing data by name instead of index.
// Updated based on the actual Students sheet structure
const USER_COLUMNS = {
	STUDENT_ID: 0,        // Column A - "Student_ID"
	FIRST_NAME: 1,        // Column B - "First_Name"
	LAST_NAME: 2,         // Column C - "Last_Name"
	USERNAME: 3,          // Column D - "Email"
	PASSWORD_HASH: 15,    // Column P (16th column, 0-based index 15) - Password hash
	IS_EMAIL_VERIFIED: 23 // Column X (24th column, 0-based index 23) - Email verification status
};

function resolveKeyFilePath(configPath) {
	if (!configPath) return '';
	if (path.isAbsolute(configPath) && fs.existsSync(configPath)) return configPath;
	// Try relative to backend root (.. from this file)
	const backendRoot = path.join(__dirname, '..');
	const candidate1 = path.join(backendRoot, configPath);
	if (fs.existsSync(candidate1)) return candidate1;
	// Try relative to this directory
	const candidate2 = path.join(__dirname, configPath);
	if (fs.existsSync(candidate2)) return candidate2;
	// Common default: file placed next to this module
	const candidate3 = path.join(__dirname, 'service-account-key.json');
	if (fs.existsSync(candidate3)) return candidate3;
	return '';
}
/**
 * Creates and authenticates a Google Sheets API client.
 * @returns {Promise<import('googleapis').sheets_v4.Sheets>}
 */
async function getSheetsClient() {
  const keyFilePath = resolveKeyFilePath(GOOGLE_KEY_FILE);
  if (!keyFilePath) {
    throw new Error(`Service account key file not found. Check GOOGLE_KEY_FILE path.`);
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

// Convert 0-based column index to A1 column letters
function columnIndexToLetter(index) {
  let dividend = index + 1;
  let columnName = '';
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }
  return columnName;
}

/**
 * Finds a user by their username (email) in the Google Sheet.
 * @param {string} username - The username (email) to search for.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function findUserByUsername(username) {
  try {
    console.log('Looking for user with username:', username);
    const rows = await readSheetData(GOOGLE_USERS_SHEET_NAME);
    
    if (!rows || rows.length === 0) {
      console.log('No data found in the sheet');
      return null;
    }
    
    console.log('First few rows from sheet:', rows.slice(0, 3));
    
    // Get headers (first row)
    const headers = (rows[0] || []).map(h => (h || '').toString().trim().toLowerCase());
    console.log('Headers:', headers);
    
    // Find column indices by header names
    const findColumnIndex = (possibleNames) => {
      for (const name of possibleNames) {
        const index = headers.indexOf(name.toLowerCase());
        if (index >= 0) return index;
      }
      return -1;
    };
    
    // Try to find email column with common header names
    const emailColumn = findColumnIndex(['email', 'username', 'user', 'email address']) || USER_COLUMNS.USERNAME;
    console.log('Using column index', emailColumn, 'for email/username');
    
    // Skip header row and find matching user
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i] || [];
      if (!row || row.length <= emailColumn) {
        console.log('Skipping row', i + 1, 'due to missing data');
        continue;
      }
      
      const userEmail = (row[emailColumn] || '').toString().toLowerCase().trim();
      console.log(`Row ${i + 1} - Email:`, userEmail);
      
      if (userEmail === username.toLowerCase().trim()) {
        console.log('Found matching user at row', i + 1, ':', row);
        // Return an object with the row data and column indices
        return {
          row,
          email: userEmail,
          firstName: row[USER_COLUMNS.FIRST_NAME] || '',
          lastName: row[USER_COLUMNS.LAST_NAME] || '',
          password: row[USER_COLUMNS.PASSWORD_HASH] || '',
          studentId: row[USER_COLUMNS.STUDENT_ID] || '',
          isEmailVerified: row[USER_COLUMNS.IS_EMAIL_VERIFIED] || false
        };
      }
    }
    
    console.log('No user found with username:', username);
    return null;
  } catch (error) {
    console.error('Error in findUserByUsername:', error);
    throw error;
  }
}

/**
 * Creates a new user by appending a row to the Google Sheet.
 * @param {{ username: string, firstName?: string, lastName?: string, password?: string }} userData
 * @returns {Promise<Object>} Result of the append operation
 */
async function createUser(userData) {
  try {
    const sheets = await getSheetsClient();
    const range = `${GOOGLE_USERS_SHEET_NAME}!A:X`;

    // Read headers to determine column indices
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range,
    });
    const rows = resp.data.values || [];
    const headers = (rows[0] || []).map(h => (h || '').toString().trim().toLowerCase());
    const findIdx = (names) => {
      for (const n of names) {
        const idx = headers.indexOf(n.toLowerCase());
        if (idx >= 0) return idx;
      }
      return -1;
    };

    const emailIdx = (() => {
      const idx = findIdx(['email address','email','username','user','email id','e-mail']);
      return idx >= 0 ? idx : USER_COLUMNS.USERNAME;
    })();
    const firstNameIdx = (() => {
      const idx = findIdx(['first name','firstname','first']);
      return idx >= 0 ? idx : USER_COLUMNS.FIRST_NAME;
    })();
    const lastNameIdx = (() => {
      const idx = findIdx(['last name','lastname','last']);
      return idx >= 0 ? idx : USER_COLUMNS.LAST_NAME;
    })();
    const passwordIdx = (() => {
      const idx = findIdx(['password hash','password','hash']);
      return idx >= 0 ? idx : USER_COLUMNS.PASSWORD_HASH;
    })();

    const width = Math.max(headers.length, 24);
    const row = new Array(width).fill('');
    row[emailIdx] = (userData.username || '').toString();
    if (userData.firstName !== undefined) row[firstNameIdx] = (userData.firstName || '').toString();
    if (userData.lastName !== undefined) row[lastNameIdx] = (userData.lastName || '').toString();
    if (userData.password !== undefined) row[passwordIdx] = (userData.password || '').toString();

    return await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${GOOGLE_USERS_SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [row] },
    });
  } catch (err) {
    console.error('Error writing to Google Sheet (createUser):', err);
    throw new Error('Could not create user in the database.');
  }
}

/**
 * Updates the password for an existing user in the Google Sheet.
 * @param {string} username - The username (email) to update.
 * @param {string} hashedPassword - The new hashed password.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUserPassword(username, hashedPassword) {
  try {
    const sheets = await getSheetsClient();
    const range = `${GOOGLE_USERS_SHEET_NAME}!A:X`;

    // First, get all rows to find the user's row
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: range,
    });

    const rows = resp.data.values || [];
    if (!rows.length) throw new Error('User not found for password update');

    const headers = (rows[0] || []).map(h => (h || '').toString().trim().toLowerCase());
    const findIdx = (names) => {
      for (const n of names) {
        const idx = headers.indexOf(n.toLowerCase());
        if (idx >= 0) return idx;
      }
      return -1;
    };
    const emailIdx = (() => {
      const idx = findIdx(['email address','email','username','user','email id','e-mail']);
      return idx >= 0 ? idx : USER_COLUMNS.USERNAME;
    })();
    const passwordIdx = (() => {
      const idx = findIdx(['password hash','password','hash']);
      return idx >= 0 ? idx : USER_COLUMNS.PASSWORD_HASH;
    })();

    const target = (username || '').toString().trim().toLowerCase();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i] || [];
      const email = (row[emailIdx] || '').toString().trim().toLowerCase();
      if (email && email === target) {
        const rowNumber = i + 1; // 1-based
        const colLetter = columnIndexToLetter(passwordIdx);
        const cellAddress = `${GOOGLE_USERS_SHEET_NAME}!${colLetter}${rowNumber}`;

        return await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SPREADSHEET_ID,
          range: cellAddress,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [[hashedPassword]] },
        });
      }
    }

    throw new Error('User not found for password update');
  } catch (err) {
    console.error('Error updating password in Google Sheet:', err);
    throw new Error('Could not update password in the database.');
  }
}

// ==================== GENERIC SHEET FUNCTIONS ====================

/**
{{ ... }}
 * @param {string} sheetName - Name of the sheet to read from
 * @param {string} range - Range to read (e.g., 'A:Z' or 'A1:C10')
 * @returns {Promise<Array>} Array of rows
 */
async function readSheetData(sheetName, range = 'A:Z') {
	try {
		const sheets = await getSheetsClient();
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: `${sheetName}!${range}`,
		});
		return response.data.values || [];
	} catch (err) {
		console.error(`Error reading from sheet ${sheetName}:`, err);
		throw new Error(`Could not read data from ${sheetName} sheet.`);
	}
}

/**
 * Generic function to append data to any sheet
 * @param {string} sheetName - Name of the sheet to append to
 * @param {Array} rowData - Array of values to append as a row
 * @returns {Promise<Object>} Result of the append operation
 */
async function appendToSheet(sheetName, rowData) {
	try {
		const sheets = await getSheetsClient();
		return await sheets.spreadsheets.values.append({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: `${sheetName}!A1`,
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'INSERT_ROWS',
			resource: { values: [rowData] },
		});
	} catch (err) {
		console.error(`Error appending to sheet ${sheetName}:`, err);
		throw new Error(`Could not append data to ${sheetName} sheet.`);
	}
}

/**
 * Generic function to update a specific cell or range in any sheet
 * @param {string} sheetName - Name of the sheet to update
 * @param {string} range - Range to update (e.g., 'A1' or 'A1:C3')
 * @param {Array} values - 2D array of values to update
 * @returns {Promise<Object>} Result of the update operation
 */
async function updateSheetData(sheetName, range, values) {
	try {
		const sheets = await getSheetsClient();
		return await sheets.spreadsheets.values.update({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: `${sheetName}!${range}`,
			valueInputOption: 'USER_ENTERED',
			resource: { values },
		});
	} catch (err) {
		console.error(`Error updating sheet ${sheetName}:`, err);
		throw new Error(`Could not update data in ${sheetName} sheet.`);
	}
}

/**
 * Generic function to find rows in any sheet based on a condition
 * @param {string} sheetName - Name of the sheet to search in
 * @param {Function} condition - Function that takes a row and returns true if it matches
 * @param {string} range - Range to search in (default: 'A:Z')
 * @returns {Promise<Array>} Array of matching rows with their row numbers
 */
async function findRowsInSheet(sheetName, condition, range = 'A:Z') {
	try {
		const rows = await readSheetData(sheetName, range);
		const matches = [];
		
		for (let i = 0; i < rows.length; i++) {
			if (condition(rows[i], i)) {
				matches.push({
					row: rows[i],
					rowNumber: i + 1, // Google Sheets uses 1-based indexing
					index: i
				});
			}
		}
		
		return matches;
	} catch (err) {
		console.error(`Error searching in sheet ${sheetName}:`, err);
		throw new Error(`Could not search in ${sheetName} sheet.`);
	}
}

/**
 * Get all available sheets in the spreadsheet
 * @returns {Promise<Array>} Array of sheet names
 */
async function getAllSheets() {
	try {
		const sheets = await getSheetsClient();
		const response = await sheets.spreadsheets.get({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
		});
		
		return response.data.sheets.map(sheet => sheet.properties.title);
	} catch (err) {
		console.error('Error getting sheet list:', err);
		throw new Error('Could not retrieve sheet list.');
	}
}

module.exports = {
	// Original user functions
	findUserByUsername,
	createUser,
	updateUserPassword,
	
	// Generic sheet functions
	readSheetData,
	appendToSheet,
	updateSheetData,
	findRowsInSheet,
	getAllSheets,
	
	// Sheet names for easy access
	SHEET_NAMES,
};