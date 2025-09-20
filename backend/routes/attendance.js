const express = require('express');
const zod = require('zod');
const { authMiddlware } = require('../middlewares');
const { markAttendance, getStudentAttendance, getAttendanceSummary } = require('../goggle_apis/erp-modules');

const router = express.Router();

const markSchema = zod.object({
  studentId: zod.string().min(1, 'studentId is required'),
  courseId: zod.string().min(1, 'courseId is required'),
  date: zod.string().min(1, 'date is required'), // YYYY-MM-DD
  status: zod.enum(['Present', 'Absent', 'Late'])
});

// Mark attendance
router.post('/', authMiddlware, async (req, res) => {
  const parsed = markSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: parsed.error.errors });
  }
  try {
    const { studentId, courseId, date, status } = parsed.data;
    const result = await markAttendance(studentId, courseId, date, status);
    return res.status(201).json({ success: true, message: 'Attendance marked', sheetResult: result.data || result });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
});

// Get attendance for a student with optional filters
router.get('/student/:studentId', authMiddlware, async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    const records = await getStudentAttendance(req.params.studentId, courseId || null, startDate || null, endDate || null);
    return res.json({ success: true, data: records, count: records.length });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Get attendance summary for a student in a course
router.get('/summary/:studentId/:courseId', authMiddlware, async (req, res) => {
  try {
    const summary = await getAttendanceSummary(req.params.studentId, req.params.courseId);
    return res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return res.status(500).json({ success: false, message: 'Error fetching attendance summary', error: error.message });
  }
});

module.exports = router;
