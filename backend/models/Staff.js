// models/Staff.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// ===== FIXED HOOK - async WITHOUT next() =====
staffSchema.pre('save', async function() {
    // Only hash if password was changed
    // On normal login, password is NOT modified, so it returns here immediately and does nothing
    if (!this.isModified('password')) return;

    // If password is already hashed, do not hash twice
    if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
        return;
    }

    // If password is empty (social login), skip
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Staff', staffSchema);