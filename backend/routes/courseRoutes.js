const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  createCourse, 
  getInstructorCourses, 
  getAllCourses, 
  enrollInCourse, 
  getCourseById,
  getInstructorCourseDetail 
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', protect, authorize('instructor', 'admin'), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'document', maxCount: 1 }]), createCourse);

// NEW ROUTE: Must be above /instructor/:instructorId to avoid route conflicts
router.get('/instructor/course/:courseId', protect, authorize('instructor', 'admin'), getInstructorCourseDetail);

router.get('/instructor/:instructorId', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/', protect, getAllCourses);
router.get('/:courseId', protect, getCourseById);
router.post('/:courseId/enroll', protect, authorize('student'), enrollInCourse);

module.exports = router;