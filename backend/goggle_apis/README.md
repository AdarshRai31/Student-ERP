# Multi-Sheet Google Sheets Database for Student ERP

This system provides a comprehensive interface to communicate with multiple Google Sheets that serve as your Student ERP database.

## Overview

The system is organized into several modules:

1. **sheets.js** - Core Google Sheets API functions and generic sheet operations
2. **erp-modules.js** - Specific functions for ERP operations (courses, grades, attendance, etc.)
3. **config.js** - Configuration for all sheet names and settings

## Sheet Structure

Your Google Spreadsheet should contain the following sheets:

### 1. Master_Students (Users Sheet)
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Auto-generated ID |
| B | Timestamp | Registration timestamp |
| C | Email | Student email (username) |
| D | First Name | Student's first name |
| E | Middle Name | Student's middle name |
| F | Last Name | Student's last name |
| ... | ... | Other student details |
| X | Password | Hashed password |

### 2. Courses Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Course ID | Unique course identifier |
| B | Course Name | Full course name |
| C | Credits | Number of credits |
| D | Department | Department offering the course |
| E | Faculty ID | Assigned faculty member |
| F | Description | Course description |

### 3. Enrollments Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Student ID | Student email/ID |
| B | Course ID | Course identifier |
| C | Semester | Semester (e.g., "Fall 2024") |
| D | Enrollment Date | Date of enrollment |
| E | Status | Active/Inactive/Dropped |

### 4. Grades Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Student ID | Student email/ID |
| B | Course ID | Course identifier |
| C | Semester | Semester |
| D | Grade | Letter grade (A, B, C, D, F) |
| E | Points | Grade points (4.0, 3.0, etc.) |
| F | Grade Date | Date grade was assigned |

### 5. Attendance Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Student ID | Student email/ID |
| B | Course ID | Course identifier |
| C | Date | Date of class (YYYY-MM-DD) |
| D | Status | Present/Absent/Late |
| E | Timestamp | When attendance was marked |

### 6. Faculty Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Faculty ID | Unique faculty identifier |
| B | Name | Full name |
| C | Email | Email address |
| D | Department | Department |
| E | Phone | Phone number |
| F | Specialization | Area of expertise |

## Usage Examples

### Basic Sheet Operations

```javascript
const { readSheetData, appendToSheet, updateSheetData, findRowsInSheet, getAllSheets, SHEET_NAMES } = require('./sheets');

// Read all data from a sheet
const coursesData = await readSheetData(SHEET_NAMES.COURSES);

// Add a new row to any sheet
await appendToSheet(SHEET_NAMES.COURSES, ['CS101', 'Introduction to Programming', 3, 'Computer Science', 'PROF001']);

// Update specific cells
await updateSheetData(SHEET_NAMES.COURSES, 'B2', [['Updated Course Name']]);

// Find rows based on condition
const matches = await findRowsInSheet(
    SHEET_NAMES.COURSES,
    (row, index) => index > 0 && row[3] === 'Computer Science' // Find CS courses
);

// Get all available sheets
const allSheets = await getAllSheets();
console.log('Available sheets:', allSheets);
```

### ERP-Specific Operations

```javascript
const {
    getAllCourses,
    addCourse,
    enrollStudent,
    getStudentEnrollments,
    addOrUpdateGrade,
    getStudentGrades,
    markAttendance,
    getAttendanceSummary
} = require('./erp-modules');

// Course Management
const courses = await getAllCourses();
await addCourse({
    courseId: 'CS102',
    courseName: 'Data Structures',
    credits: 4,
    department: 'Computer Science',
    facultyId: 'PROF001',
    description: 'Introduction to data structures and algorithms'
});

// Enrollment Management
await enrollStudent('student@example.com', 'CS102', 'Fall 2024');
const studentCourses = await getStudentEnrollments('student@example.com');

// Grade Management
await addOrUpdateGrade('student@example.com', 'CS102', 'Fall 2024', 'A', 4.0);
const grades = await getStudentGrades('student@example.com');

// Attendance Management
await markAttendance('student@example.com', 'CS102', '2024-09-19', 'Present');
const attendanceSummary = await getAttendanceSummary('student@example.com', 'CS102');
console.log(`Attendance: ${attendanceSummary.percentage}%`);
```

### Creating New Route Handlers

Here's an example of how to create a new route for course management:

```javascript
// routes/courses.js
const express = require('express');
const { authMiddlware } = require('../middlewares');
const { getAllCourses, addCourse, findCourseById } = require('../goggle_apis/erp-modules');

const router = express.Router();

// Get all courses
router.get('/', authMiddlware, async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

// Get specific course
router.get('/:courseId', authMiddlware, async (req, res) => {
    try {
        const course = await findCourseById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
});

// Add new course (admin only)
router.post('/', authMiddlware, async (req, res) => {
    try {
        const result = await addCourse(req.body);
        res.status(201).json({ message: 'Course added successfully', result });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Error adding course' });
    }
});

module.exports = router;
```

## Environment Variables

Add these to your `.env` file to customize sheet names:

```env
# Required
GOOGLE_KEY_FILE=path/to/service-account-key.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# Optional - Sheet names (defaults provided)
GOOGLE_USERS_SHEET_NAME=Master_Students
GOOGLE_COURSES_SHEET_NAME=Courses
GOOGLE_ENROLLMENTS_SHEET_NAME=Enrollments
GOOGLE_GRADES_SHEET_NAME=Grades
GOOGLE_ATTENDANCE_SHEET_NAME=Attendance
GOOGLE_FACULTY_SHEET_NAME=Faculty
GOOGLE_DEPARTMENTS_SHEET_NAME=Departments
```

## Error Handling

All functions include proper error handling and will throw descriptive errors. Always wrap your calls in try-catch blocks:

```javascript
try {
    const result = await someSheetOperation();
    // Handle success
} catch (error) {
    console.error('Operation failed:', error.message);
    // Handle error appropriately
}
```

## Best Practices

1. **Always validate data** before writing to sheets
2. **Use transactions** for related operations (e.g., enrollment + grade creation)
3. **Cache frequently accessed data** to reduce API calls
4. **Implement proper authentication** and authorization
5. **Log all database operations** for audit trails
6. **Handle rate limits** - Google Sheets API has usage quotas

## Next Steps

1. Create route handlers for each ERP module
2. Implement proper validation schemas using Zod
3. Add caching layer (Redis) for frequently accessed data
4. Implement audit logging for all database operations
5. Add bulk operations for efficiency
6. Create admin panel for sheet management

## Troubleshooting

### Common Issues

1. **"Sheet not found" errors**: Ensure sheet names in config match actual sheet names
2. **Authentication errors**: Verify service account key file path and permissions
3. **Rate limit errors**: Implement exponential backoff and caching
4. **Data format errors**: Ensure data types match expected formats (dates, numbers, etc.)

### Debugging

Enable detailed logging by setting `NODE_ENV=development` and check console outputs for detailed error messages.
