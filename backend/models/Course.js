const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  
  // NEW: Array to track enrolled students
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],

  videoUrl: { type: String }, 
  documentUrl: { type: String },
  status: { type: String, default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);