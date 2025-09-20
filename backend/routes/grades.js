const express = require('express');
const zod = require('zod');
const { authMiddlware } = require('../middlewares');
const { addOrUpdateGrade, getStudentGrades } = require('../goggle_apis/erp-modules');

const router = express.Router();

const gradeSchema = zod.object({
  studentId: zod.string().min(1, 'studentId is required'),
  courseId: zod.string().min(1, 'courseId is required'),
  semester: zod.string().min(1, 'semester is required'),
  grade: zod.string().min(1, 'grade is required'),
  points: zod.number().min(0, 'points must be >= 0')
});

// Add or update a grade
router.post('/', authMiddlware, async (req, res) => {
  const parsed = gradeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: parsed.error.errors });
  }
  try {
    const { studentId, courseId, semester, grade, points } = parsed.data;
    const result = await addOrUpdateGrade(studentId, courseId, semester, grade, points);
    return res.status(201).json({ success: true, message: 'Grade saved', sheetResult: result.data || result });
  } catch (error) {
    console.error('Error saving grade:', error);
    return res.status(500).json({ success: false, message: 'Error saving grade', error: error.message });
  }
});

// Get grades for a student (optional semester query)
router.get('/student/:studentId', authMiddlware, async (req, res) => {
  try {
    const { semester } = req.query;
    const grades = await getStudentGrades(req.params.studentId, semester || null);
    return res.json({ success: true, data: grades, count: grades.length });
  } catch (error) {
    console.error('Error fetching student grades:', error);
    return res.status(500).json({ success: false, message: 'Error fetching grades', error: error.message });
  }
});

module.exports = router;
