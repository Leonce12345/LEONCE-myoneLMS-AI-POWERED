const mongoose = require('mongoose');

const courseChunkSchema = new mongoose.Schema({
  // Changed from ObjectId to String for Vector Search compatibility
  courseId: { type: String, required: true }, 
  text: { type: String, required: true },
  embedding: { type: [Number], required: true }
}, { timestamps: true });

module.exports = mongoose.model('CourseChunk', courseChunkSchema);