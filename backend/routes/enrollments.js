const express = require('express');
const zod = require('zod');
const { authMiddlware } = require('../middlewares');
const { enrollStudent, getStudentEnrollments, getCourseEnrollments } = require('../goggle_apis/erp-modules');

const router = express.Router();

const enrollSchema = zod.object({
  studentId: zod.string().min(1, 'studentId is required'),
  courseId: zod.string().min(1, 'courseId is required'),
  semester: zod.string().min(1, 'semester is required')
});

// Enroll a student in a course
router.post('/', authMiddlware, async (req, res) => {
  const parsed = enrollSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: parsed.error.errors });
  }
  try {
    const result = await enrollStudent(parsed.data.studentId, parsed.data.courseId, parsed.data.semester);
    return res.status(201).json({ success: true, message: 'Enrolled successfully', sheetResult: result.data || result });
  } catch (error) {
    console.error('Error enrolling student:', error);
    return res.status(500).json({ success: false, message: 'Error enrolling student', error: error.message });
  }
});

// Get enrollments for a student
router.get('/student/:studentId', authMiddlware, async (req, res) => {
  try {
    const enrollments = await getStudentEnrollments(req.params.studentId);
    return res.json({ success: true, data: enrollments, count: enrollments.length });
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    return res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
  }
});

// Get enrollments for a course (optional semester)
router.get('/course/:courseId', authMiddlware, async (req, res) => {
  try {
    const { semester } = req.query;
    const enrollments = await getCourseEnrollments(req.params.courseId, semester || null);
    return res.json({ success: true, data: enrollments, count: enrollments.length });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
  }
});

module.exports = router;
