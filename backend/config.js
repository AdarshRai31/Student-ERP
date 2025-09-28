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

// Email configuration
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USERNAME;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
// Handle Google Cloud credentials
let GOOGLE_CREDENTIALS;
try {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    console.log('Using Google credentials from environment variable');
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  } else if (process.env.NODE_ENV !== 'production') {
    console.log('Using local Google credentials file');
    const keyPath = path.join(__dirname, 'goggle_apis', 'service-account-k.json');
    console.log(`Loading service account key from: ${keyPath}`);
    if (fs.existsSync(keyPath)) {
      GOOGLE_CREDENTIALS = require(keyPath);
      console.log('Successfully loaded service account key');
    } else {
      console.error(`❌ Service account key file not found at: ${keyPath}`);
      process.exit(1);
    }
  } else {
    console.error('❌ Google Cloud credentials not found. Please set GOOGLE_CREDENTIALS_JSON environment variable in production.');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to load Google Cloud credentials:', error);
  process.exit(1);
}

// Use the full path to the key file for better error messages
const GOOGLE_KEY_FILE = path.join(__dirname, 'goggle_apis', 'service-account-k.json');
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
	GOOGLE_CREDENTIALS,
	GOOGLE_KEY_FILE,
	GOOGLE_SPREADSHEET_ID,
	GOOGLE_USERS_SHEET_NAME,
	// Email settings
	EMAIL_SERVICE,
	EMAIL_USERNAME,
	EMAIL_PASSWORD,
	EMAIL_FROM,
	APP_URL,
	SHEET_NAMES,
};