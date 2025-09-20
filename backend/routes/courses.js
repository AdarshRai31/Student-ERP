const express = require('express');
const zod = require('zod');
const { authMiddlware } = require('../middlewares');
const { getAllCourses, addCourse, findCourseById } = require('../goggle_apis/erp-modules');

const router = express.Router();

// Validation schema for course creation
const courseSchema = zod.object({
    courseId: zod.string().min(1, "Course ID is required"),
    courseName: zod.string().min(1, "Course name is required"),
    credits: zod.number().min(1).max(6),
    department: zod.string().min(1, "Department is required"),
    facultyId: zod.string().min(1, "Faculty ID is required"),
    description: zod.string().optional()
});

// Get all courses
router.get('/', authMiddlware, async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.json({
            success: true,
            data: courses,
            count: courses.length
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching courses',
            error: error.message 
        });
    }
});

// Get specific course by ID
router.get('/:courseId', authMiddlware, async (req, res) => {
    try {
        const course = await findCourseById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }
        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching course',
            error: error.message 
        });
    }
});

// Add new course
router.post('/', authMiddlware, async (req, res) => {
    try {
        // Validate input data
        const { success, data, error } = courseSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data',
                errors: error.errors
            });
        }

        // Check if course already exists
        const existingCourse = await findCourseById(data.courseId);
        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: 'Course with this ID already exists'
            });
        }

        // Add the course
        const result = await addCourse(data);
        
        res.status(201).json({ 
            success: true,
            message: 'Course added successfully',
            data: data,
            sheetResult: result
        });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding course',
            error: error.message 
        });
    }
});

module.exports = router;
