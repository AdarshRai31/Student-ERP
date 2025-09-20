const { readSheetData, appendToSheet, updateSheetData, findRowsInSheet, SHEET_NAMES } = require('./sheets');

// ==================== COURSE MANAGEMENT ====================

/**
 * Get all courses
 * @returns {Promise<Array>} Array of course objects
 */
async function getAllCourses() {
    try {
        const rows = await readSheetData(SHEET_NAMES.COURSES);
        if (!rows || rows.length <= 1) return [];
        
        // Assuming first row is headers: Course ID, Course Name, Credits, Department, Faculty ID
        return rows.slice(1).map(row => ({
            courseId: row[0] || '',
            courseName: row[1] || '',
            credits: parseInt(row[2]) || 0,
            department: row[3] || '',
            facultyId: row[4] || '',
            description: row[5] || ''
        }));
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
}

/**
 * Add a new course
 * @param {Object} courseData - Course information
 * @returns {Promise<Object>} Result of the operation
 */
async function addCourse(courseData) {
    const { courseId, courseName, credits, department, facultyId, description = '' } = courseData;
    const rowData = [courseId, courseName, credits, department, facultyId, description];
    return await appendToSheet(SHEET_NAMES.COURSES, rowData);
}

/**
 * Find course by ID
 * @param {string} courseId - Course ID to search for
 * @returns {Promise<Object|null>} Course object or null
 */
async function findCourseById(courseId) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.COURSES,
            (row, index) => index > 0 && row[0] === courseId // Skip header row
        );
        
        if (matches.length === 0) return null;
        
        const row = matches[0].row;
        return {
            courseId: row[0] || '',
            courseName: row[1] || '',
            credits: parseInt(row[2]) || 0,
            department: row[3] || '',
            facultyId: row[4] || '',
            description: row[5] || ''
        };
    } catch (error) {
        console.error('Error finding course:', error);
        throw error;
    }
}

// ==================== ENROLLMENT MANAGEMENT ====================

/**
 * Enroll a student in a course
 * @param {string} studentId - Student email/ID
 * @param {string} courseId - Course ID
 * @param {string} semester - Semester (e.g., "Fall 2024")
 * @returns {Promise<Object>} Result of the operation
 */
async function enrollStudent(studentId, courseId, semester) {
    const enrollmentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const rowData = [studentId, courseId, semester, enrollmentDate, 'Active'];
    return await appendToSheet(SHEET_NAMES.ENROLLMENTS, rowData);
}

/**
 * Get enrollments for a student
 * @param {string} studentId - Student email/ID
 * @returns {Promise<Array>} Array of enrollment objects
 */
async function getStudentEnrollments(studentId) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.ENROLLMENTS,
            (row, index) => index > 0 && row[0] === studentId // Skip header row
        );
        
        return matches.map(match => ({
            studentId: match.row[0] || '',
            courseId: match.row[1] || '',
            semester: match.row[2] || '',
            enrollmentDate: match.row[3] || '',
            status: match.row[4] || 'Active'
        }));
    } catch (error) {
        console.error('Error getting student enrollments:', error);
        throw error;
    }
}

/**
 * Get all students enrolled in a course
 * @param {string} courseId - Course ID
 * @param {string} semester - Semester (optional)
 * @returns {Promise<Array>} Array of student enrollment objects
 */
async function getCourseEnrollments(courseId, semester = null) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.ENROLLMENTS,
            (row, index) => {
                if (index === 0) return false; // Skip header
                const matchesCourse = row[1] === courseId;
                const matchesSemester = !semester || row[2] === semester;
                return matchesCourse && matchesSemester;
            }
        );
        
        return matches.map(match => ({
            studentId: match.row[0] || '',
            courseId: match.row[1] || '',
            semester: match.row[2] || '',
            enrollmentDate: match.row[3] || '',
            status: match.row[4] || 'Active'
        }));
    } catch (error) {
        console.error('Error getting course enrollments:', error);
        throw error;
    }
}

// ==================== GRADES MANAGEMENT ====================

/**
 * Add or update a grade
 * @param {string} studentId - Student email/ID
 * @param {string} courseId - Course ID
 * @param {string} semester - Semester
 * @param {string} grade - Grade (A, B, C, D, F)
 * @param {number} points - Grade points
 * @returns {Promise<Object>} Result of the operation
 */
async function addOrUpdateGrade(studentId, courseId, semester, grade, points) {
    try {
        // First, check if grade already exists
        const existingGrades = await findRowsInSheet(
            SHEET_NAMES.GRADES,
            (row, index) => index > 0 && row[0] === studentId && row[1] === courseId && row[2] === semester
        );
        
        const gradeDate = new Date().toISOString().split('T')[0];
        
        if (existingGrades.length > 0) {
            // Update existing grade
            const rowNumber = existingGrades[0].rowNumber;
            const range = `D${rowNumber}:F${rowNumber}`; // Grade, Points, Date columns
            return await updateSheetData(SHEET_NAMES.GRADES, range, [[grade, points, gradeDate]]);
        } else {
            // Add new grade
            const rowData = [studentId, courseId, semester, grade, points, gradeDate];
            return await appendToSheet(SHEET_NAMES.GRADES, rowData);
        }
    } catch (error) {
        console.error('Error adding/updating grade:', error);
        throw error;
    }
}

/**
 * Get grades for a student
 * @param {string} studentId - Student email/ID
 * @param {string} semester - Semester (optional)
 * @returns {Promise<Array>} Array of grade objects
 */
async function getStudentGrades(studentId, semester = null) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.GRADES,
            (row, index) => {
                if (index === 0) return false; // Skip header
                const matchesStudent = row[0] === studentId;
                const matchesSemester = !semester || row[2] === semester;
                return matchesStudent && matchesSemester;
            }
        );
        
        return matches.map(match => ({
            studentId: match.row[0] || '',
            courseId: match.row[1] || '',
            semester: match.row[2] || '',
            grade: match.row[3] || '',
            points: parseFloat(match.row[4]) || 0,
            gradeDate: match.row[5] || ''
        }));
    } catch (error) {
        console.error('Error getting student grades:', error);
        throw error;
    }
}

// ==================== ATTENDANCE MANAGEMENT ====================

/**
 * Mark attendance for a student
 * @param {string} studentId - Student email/ID
 * @param {string} courseId - Course ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} status - Attendance status (Present, Absent, Late)
 * @returns {Promise<Object>} Result of the operation
 */
async function markAttendance(studentId, courseId, date, status) {
    const rowData = [studentId, courseId, date, status, new Date().toISOString()];
    return await appendToSheet(SHEET_NAMES.ATTENDANCE, rowData);
}

/**
 * Get attendance records for a student
 * @param {string} studentId - Student email/ID
 * @param {string} courseId - Course ID (optional)
 * @param {string} startDate - Start date (optional)
 * @param {string} endDate - End date (optional)
 * @returns {Promise<Array>} Array of attendance objects
 */
async function getStudentAttendance(studentId, courseId = null, startDate = null, endDate = null) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.ATTENDANCE,
            (row, index) => {
                if (index === 0) return false; // Skip header
                const matchesStudent = row[0] === studentId;
                const matchesCourse = !courseId || row[1] === courseId;
                const matchesDateRange = (!startDate || row[2] >= startDate) && (!endDate || row[2] <= endDate);
                return matchesStudent && matchesCourse && matchesDateRange;
            }
        );
        
        return matches.map(match => ({
            studentId: match.row[0] || '',
            courseId: match.row[1] || '',
            date: match.row[2] || '',
            status: match.row[3] || '',
            timestamp: match.row[4] || ''
        }));
    } catch (error) {
        console.error('Error getting student attendance:', error);
        throw error;
    }
}

/**
 * Get attendance summary for a student in a course
 * @param {string} studentId - Student email/ID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Attendance summary
 */
async function getAttendanceSummary(studentId, courseId) {
    try {
        const attendance = await getStudentAttendance(studentId, courseId);
        
        const summary = {
            total: attendance.length,
            present: 0,
            absent: 0,
            late: 0,
            percentage: 0
        };
        
        attendance.forEach(record => {
            switch (record.status.toLowerCase()) {
                case 'present':
                    summary.present++;
                    break;
                case 'absent':
                    summary.absent++;
                    break;
                case 'late':
                    summary.late++;
                    break;
            }
        });
        
        if (summary.total > 0) {
            summary.percentage = ((summary.present + summary.late) / summary.total * 100).toFixed(2);
        }
        
        return summary;
    } catch (error) {
        console.error('Error getting attendance summary:', error);
        throw error;
    }
}

// ==================== FACULTY MANAGEMENT ====================

/**
 * Get all faculty members
 * @returns {Promise<Array>} Array of faculty objects
 */
async function getAllFaculty() {
    try {
        const rows = await readSheetData(SHEET_NAMES.FACULTY);
        if (!rows || rows.length <= 1) return [];
        
        // Assuming first row is headers: Faculty ID, Name, Email, Department, Phone
        return rows.slice(1).map(row => ({
            facultyId: row[0] || '',
            name: row[1] || '',
            email: row[2] || '',
            department: row[3] || '',
            phone: row[4] || '',
            specialization: row[5] || ''
        }));
    } catch (error) {
        console.error('Error getting faculty:', error);
        throw error;
    }
}

/**
 * Find faculty by ID
 * @param {string} facultyId - Faculty ID to search for
 * @returns {Promise<Object|null>} Faculty object or null
 */
async function findFacultyById(facultyId) {
    try {
        const matches = await findRowsInSheet(
            SHEET_NAMES.FACULTY,
            (row, index) => index > 0 && row[0] === facultyId // Skip header row
        );
        
        if (matches.length === 0) return null;
        
        const row = matches[0].row;
        return {
            facultyId: row[0] || '',
            name: row[1] || '',
            email: row[2] || '',
            department: row[3] || '',
            phone: row[4] || '',
            specialization: row[5] || ''
        };
    } catch (error) {
        console.error('Error finding faculty:', error);
        throw error;
    }
}

module.exports = {
    // Course Management
    getAllCourses,
    addCourse,
    findCourseById,
    
    // Enrollment Management
    enrollStudent,
    getStudentEnrollments,
    getCourseEnrollments,
    
    // Grades Management
    addOrUpdateGrade,
    getStudentGrades,
    
    // Attendance Management
    markAttendance,
    getStudentAttendance,
    getAttendanceSummary,
    
    // Faculty Management
    getAllFaculty,
    findFacultyById,
};
