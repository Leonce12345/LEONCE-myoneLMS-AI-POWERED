// models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            // Password is only required if NO social login ID is present
            return !this.googleId && !this.facebookId && !this.tiktokId;
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    tiktokId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        default: 'New User',
        trim: true
    },
    department: {
        type: String,
        default: 'Unassigned'
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'instructor', 'student'],
            message: '{VALUE} is not a valid role'
        },
        default: 'student'
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // ===== NEW FIELDS FOR FORGOT PASSWORD =====
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpiry: {
        type: Date,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);