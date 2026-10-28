// controllers/authController.js
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendOTPEmail = require('../utils/sendEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateResetToken = () => crypto.randomBytes(32).toString('hex');

// Registration Controller
exports.registerStaff = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await Staff.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();
        const assignedRole = ['admin', 'instructor', 'student'].includes(role) ? role : 'student';
        const newStaff = new Staff({
            email: normalizedEmail,
            password: hashedPassword,
            name: name || 'New User',
            department: 'Data Annotation',
            role: assignedRole,
            otp: otp,
            otpExpiry: Date.now() + 10 * 60 * 1000
        });
        await newStaff.save();
        let emailSent = false;
        if (process.env.NODE_ENV !== 'test') {
            try {
                await sendOTPEmail(normalizedEmail, otp);
                emailSent = true;
            } catch (emailErr) {
                console.error('Failed to send registration OTP email:', emailErr.message);
            }
        }
        res.status(201).json({
            message: emailSent ? 'Registration successful. Please verify your OTP.' : 'Registration successful, but failed to send OTP email.',
            requiresOTP: true,
            email: newStaff.email
        });
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login Controller
exports.loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const staff = await Staff.findOne({ email: normalizedEmail });
        if (!staff) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const otp = generateOTP();
        staff.otp = otp;
        staff.otpExpiry = Date.now() + 10 * 60 * 1000;
        await staff.save();
        let emailSent = false;
        if (process.env.NODE_ENV !== 'test') {
            try {
                await sendOTPEmail(staff.email, otp);
                emailSent = true;
            } catch (emailErr) {
                console.error('Failed to send login OTP email:', emailErr.message);
            }
        }
        res.status(200).json({
            message: emailSent ? 'Credentials valid. OTP sent to email.' : 'Credentials valid, but failed to send OTP email.',
            requiresOTP: true,
            email: staff.email
        });
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// OTP Verification Controller (Login)
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (typeof email !== 'string' || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ error: 'A valid email and 6-digit OTP are required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const staff = await Staff.findOne({ email: normalizedEmail });
        if (!staff || staff.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        if (!staff.otpExpiry || staff.otpExpiry.getTime() <= Date.now()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        staff.otp = null;
        staff.otpExpiry = null;
        staff.isVerified = true;
        await staff.save();
        if (req.session) {
            req.session.userId = staff._id.toString();
        }
        const token = jwt.sign(
            { id: staff._id, role: staff.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message: 'Authentication successful',
            token,
            user: { id: staff._id, email: staff.email, name: staff.name, role: staff.role }
        });
    } catch (error) {
        console.error('Error in verify route:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};

// ===== NEW: Forgot Password - works for normal + Google users =====
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const normalizedEmail = email.toLowerCase().trim();
        const staff = await Staff.findOne({ email: normalizedEmail });
        if (!staff) return res.status(404).json({ message: 'No account found with that email' });
        const otp = generateOTP();
        staff.resetOtp = otp;
        staff.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
        staff.resetToken = null;
        staff.resetTokenExpiry = null;
        await staff.save();
        let emailSent = false;
        try {
            await sendOTPEmail(staff.email, otp);
            emailSent = true;
        } catch (err) {
            console.error('Failed to send reset OTP:', err.message);
        }
        res.status(200).json({
            message: emailSent ? 'Password reset code sent to email' : 'Code generated but email failed to send',
            email: staff.email
        });
    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== NEW: Verify Reset OTP =====
exports.verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ error: 'Valid email and 6-digit OTP required' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const staff = await Staff.findOne({ email: normalizedEmail });
        if (!staff || staff.resetOtp !== otp) {
            return res.status(400).json({ error: 'Invalid reset code' });
        }
        if (!staff.resetOtpExpiry || staff.resetOtpExpiry.getTime() <= Date.now()) {
            return res.status(400).json({ error: 'Reset code has expired' });
        }
        const resetToken = generateResetToken();
        staff.resetToken = resetToken;
        staff.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        staff.resetOtp = null;
        staff.resetOtpExpiry = null;
        await staff.save();
        res.status(200).json({
            message: 'Reset code verified',
            resetToken: resetToken,
            email: staff.email
        });
    } catch (error) {
        console.error('Error in verify-reset-otp:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== NEW: Reset Password =====
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password required' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const staff = await Staff.findOne({ email: normalizedEmail });
        if (!staff) return res.status(404).json({ message: 'User not found' });

        if (resetToken) {
            if (staff.resetToken !== resetToken) return res.status(400).json({ message: 'Invalid reset token' });
            if (!staff.resetTokenExpiry || staff.resetTokenExpiry.getTime() <= Date.now()) return res.status(400).json({ message: 'Reset token has expired, request again' });
        } else {
            if (!staff.resetToken || !staff.resetTokenExpiry || staff.resetTokenExpiry.getTime() <= Date.now()) return res.status(400).json({ message: 'Reset session expired, request again' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        staff.password = hashedPassword;
        staff.resetOtp = null;
        staff.resetOtpExpiry = null;
        staff.resetToken = null;
        staff.resetTokenExpiry = null;
        staff.isVerified = true;
        staff.otp = null;
        staff.otpExpiry = null;
        await staff.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in reset-password:', error);
        res.status(500).json({ message: 'Server error during reset' });
    }
};