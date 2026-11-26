// backend/models/AcademicRecord.js
const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  
  // Assignments array
  assignments: [{
    title: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Submitted', 'Graded', 'Locked'], default: 'Pending' },
    score: { type: Number, default: null },
    grade: { type: String, default: null }
  }],

  // Attendance logs
  attendance: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
  }],

  // Final Results
  finalScore: { type: Number, default: null },
  finalGrade: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);