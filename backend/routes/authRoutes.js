// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Staff = require('../models/Staff');
const { 
    registerStaff, 
    loginStaff, 
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    updateProfile,     // <-- NEW
    changePassword     // <-- NEW
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer Storage Config for Profile Avatars
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists in your backend root
    },
    filename: function (req, file, cb) {
        cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Public Routes
router.post('/register', registerStaff);
router.post('/login', loginStaff);
router.post('/verify-otp', verifyOTP);

// Forgot Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Protected Profile Routes
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Successfully logged out' });
        });
    } else {
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
});

// Admin-Only Routes
router.get('/admin/users', protect, authorize('admin'), async(req, res) => {
    try {
        const users = await Staff.find().select('-password -otp -otpExpiry -resetOtp -resetOtpExpiry -resetToken -resetTokenExpiry');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Instructor & Admin Shared Routes
router.get('/courses/manage', protect, authorize('instructor', 'admin'), (req, res) => {
    res.json({ message: 'Instructor course management dashboard content' });
});

// Student, Instructor, & Admin Accessible Route
router.get('/student/profile', protect, authorize('student', 'instructor', 'admin'), (req, res) => {
    res.json({ message: `Access granted for ${req.user.role}`, user: req.user });
});

module.exports = router;