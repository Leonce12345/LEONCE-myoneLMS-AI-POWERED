const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  assessmentName: { type: String, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);