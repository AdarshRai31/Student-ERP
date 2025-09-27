const fs = require('fs');
const path = require('path');

// Load .env if present
require('dotenv').config();

const sheetEnvPath = path.join(__dirname, 'sheet.env');
if (fs.existsSync(sheetEnvPath)) {
	require('dotenv').config({ path: sheetEnvPath, override: false });
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const PORT = process.env.PORT || 3000;
const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS_JSON 
  ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
  : require('./goggle_apis/service-account-k.json');
const GOOGLE_KEY_FILE = GOOGLE_CREDENTIALS;
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1w3p3YF1w9B3w9B3w9B3w9B3w9B3w9B3w9B3w9B3';
const GOOGLE_USERS_SHEET_NAME = process.env.GOOGLE_USERS_SHEET_NAME || "Master_Students";

// Define all sheet names for the ERP system
const SHEET_NAMES = {
	USERS: process.env.GOOGLE_USERS_SHEET_NAME || "Master_Students",
	ENROLLMENTS: process.env.GOOGLE_ENROLLMENTS_SHEET_NAME || "Enrollments",
	GRADES: process.env.GOOGLE_GRADES_SHEET_NAME || "Grades",
	ATTENDANCE: process.env.GOOGLE_ATTENDANCE_SHEET_NAME || "Attendance",
	FACULTY: process.env.GOOGLE_FACULTY_SHEET_NAME || "Faculty",
	DEPARTMENTS: process.env.GOOGLE_DEPARTMENTS_SHEET_NAME || "Departments",
};

module.exports = {
	JWT_SECRET,
	PORT,
	GOOGLE_KEY_FILE,
	GOOGLE_SPREADSHEET_ID,
	GOOGLE_USERS_SHEET_NAME,
	SHEET_NAMES,
};