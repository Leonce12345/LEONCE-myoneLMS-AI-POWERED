// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { 
    registerStaff, 
    loginStaff, 
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerStaff);
router.post('/login', loginStaff);
router.post('/verify-otp', verifyOTP);

// ===== NEW: Forgot Password Routes (Public - works for normal + Google users) =====
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

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