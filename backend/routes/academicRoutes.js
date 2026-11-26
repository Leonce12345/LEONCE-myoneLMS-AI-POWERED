// backend/routes/academicRoutes.js
const express = require('express');
const router = express.Router();
const AcademicRecord = require('../models/AcademicRecord');
const Staff = require('../models/Staff');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) { return res.status(401).json({ error: 'Invalid JWT' }); }
};

// GET: Fetch records (For both Students and Instructors)
router.get('/my-records', verifyToken, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'student') {
            query.studentId = req.user.id;
        } else if (req.user.role === 'instructor') {
            query.instructorId = req.user.id;
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }

        const records = await AcademicRecord.find(query)
            .populate('courseId', 'title')
            .populate('studentId', 'name email');
            
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Instructor creates an assignment for a course
router.post('/create-assignment', verifyToken, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Only instructors can create assignments' });
    
    const { courseId, title, dueDate } = req.body;
    
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const promises = course.enrolledStudents.map(async (studentId) => {
            let record = await AcademicRecord.findOne({ studentId, courseId });
            if (!record) {
                record = new AcademicRecord({ studentId, courseId, instructorId: req.user.id });
            }
            record.assignments.push({ title, dueDate, status: 'Pending' });
            return record.save();
        });

        await Promise.all(promises);
        res.status(201).json({ message: 'Assignment created for all students' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Instructor grades an assignment
router.put('/grade-assignment/:recordId/:assignmentId', verifyToken, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Access denied' });
    
    const { recordId, assignmentId } = req.params;
    const { score, grade } = req.body;

    try {
        const record = await AcademicRecord.findById(recordId);
        if (!record) return res.status(404).json({ error: 'Record not found' });

        const assignment = record.assignments.id(assignmentId);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

        assignment.status = 'Graded';
        assignment.score = score;
        assignment.grade = grade;

        await record.save();
        res.json({ message: 'Assignment graded', record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Instructor marks attendance for a student
router.post('/mark-attendance', verifyToken, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Access denied' });
    
    const { studentId, courseId, status } = req.body;

    try {
        let record = await AcademicRecord.findOne({ studentId, courseId });
        
        if (!record) {
            record = new AcademicRecord({ 
                studentId, 
                courseId, 
                instructorId: req.user.id,
                attendance: [] 
            });
        }

        record.attendance.push({ date: new Date(), status });
        await record.save();

        res.json({ message: 'Attendance marked', record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Instructor sets final grade for a course
router.put('/grade-final/:recordId', verifyToken, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Access denied' });
    
    const { recordId } = req.params;
    const { finalScore, finalGrade } = req.body;

    try {
        const record = await AcademicRecord.findById(recordId);
        if (!record) return res.status(404).json({ error: 'Record not found' });

        record.finalScore = finalScore;
        record.finalGrade = finalGrade;
        
        await record.save();
        res.json({ message: 'Final grade published', record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;