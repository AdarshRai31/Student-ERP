const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { GOOGLE_KEY_FILE, GOOGLE_SPREADSHEET_ID, GOOGLE_USERS_SHEET_NAME, SHEET_NAMES } = require('../config');

// Define the columns for your user data. This helps in accessing data by name instead of index.
// Based on the actual Master_Students sheet structure:
const USER_COLUMNS = {
	USERNAME: 2,      // Column C - "Email address"
	FIRST_NAME: 3,    // Column D - "First Name"
	LAST_NAME: 5,     // Column F - "Last Name"
	PASSWORD_HASH: 23, // Column X - "Password"
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

/**
 * Finds a user by their username (email) in the Google Sheet.
 * @param {string} username - The username (email) to search for.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function findUserByUsername(username) {
	try {
		const sheets = await getSheetsClient();
		const range = `${GOOGLE_USERS_SHEET_NAME}!A:X`;

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: range,
		});

		const rows = response.data.values;
		if (rows && rows.length) {
			for (let i = 1; i < rows.length; i++) {
				const row = rows[i];
				if (row[USER_COLUMNS.USERNAME] === username) {
					return {
						username: row[USER_COLUMNS.USERNAME],
						firstName: row[USER_COLUMNS.FIRST_NAME],
						lastName: row[USER_COLUMNS.LAST_NAME],
						password: row[USER_COLUMNS.PASSWORD_HASH],
					};
				}
			}
		}
		return null;
	} catch (err) {
		console.error('Error reading from Google Sheet:', err);
		throw new Error('Could not access the database.');
	}
}

/**
 * Creates a new user by appending a row to the Google Sheet.
 * @param {Object} userData - The user data to add.
 * @returns {Promise<Object>} The result of the append operation.
 */
async function createUser(userData) {
	try {
		const sheets = await getSheetsClient();
		
		// Create a row with all 24 columns, filling only the ones we need
		const row = new Array(24).fill(''); // Initialize with empty strings
		
		// Fill in the user data at the correct column positions
		row[USER_COLUMNS.USERNAME] = userData.username;        // Column C - Email address
		row[USER_COLUMNS.FIRST_NAME] = userData.firstName;     // Column D - First Name
		row[USER_COLUMNS.LAST_NAME] = userData.lastName;       // Column F - Last Name
		row[USER_COLUMNS.PASSWORD_HASH] = userData.password;   // Column X - Password
		
		const values = [row];

		return await sheets.spreadsheets.values.append({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: `${GOOGLE_USERS_SHEET_NAME}!A1`,
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'INSERT_ROWS',
			resource: { values },
		});
	} catch (err) {
		console.error('Error writing to Google Sheet:', err);
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
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SPREADSHEET_ID,
			range: range,
		});

		const rows = response.data.values;
		if (rows && rows.length) {
			for (let i = 1; i < rows.length; i++) {
				const row = rows[i];
				if (row[USER_COLUMNS.USERNAME] === username) {
					// Found the user, now update their password
					const rowNumber = i + 1; // Google Sheets uses 1-based indexing
					const cellAddress = `${GOOGLE_USERS_SHEET_NAME}!X${rowNumber}`;
					
					return await sheets.spreadsheets.values.update({
						spreadsheetId: GOOGLE_SPREADSHEET_ID,
						range: cellAddress,
						valueInputOption: 'USER_ENTERED',
						resource: {
							values: [[hashedPassword]]
						},
					});
				}
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
 * Generic function to read data from any sheet
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