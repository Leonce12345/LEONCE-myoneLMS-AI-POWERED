const Course = require('../models/Course');
const CourseChunk = require('../models/CourseChunk');
const fs = require('fs');
const pdf = require('pdf-parse');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "LearnHub LMS",
  },
});

const chunkText = (text, maxChunkSize = 1000) => {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks = [];
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence + ' ';
    } else {
      currentChunk += sentence + ' ';
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

const createCourse = async (req, res) => {
  try {
    const videoFile = req.files && req.files.video ? req.files.video[0].path : null;
    const documentFile = req.files && req.files.document ? req.files.document[0].path : null;

    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instructorId: req.body.instructorId,
      videoUrl: videoFile,
      documentUrl: documentFile
    });

    await newCourse.save();

    if (documentFile) {
      console.log("Processing PDF for AI...");
      const dataBuffer = fs.readFileSync(documentFile);
      const pdfData = await pdf(dataBuffer);
      const fullText = pdfData.text;
      const chunks = chunkText(fullText);

      for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });
        
        await CourseChunk.create({
          courseId: newCourse._id.toString(), // <-- Converts ObjectId to String
          text: chunk,
          embedding: embeddingResponse.data[0].embedding
        });
      }
      console.log(`Successfully vectorized ${chunks.length} chunks for course: ${newCourse.title}`);
    }

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) { 
    console.error("Error creating course:", error);
    res.status(500).json({ message: 'Server error' }); 
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.instructorId }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Published' }).populate('instructorId', 'name').sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const enrollInCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.enrolledStudents.includes(studentId)) return res.status(400).json({ message: 'Already enrolled' });
    course.enrolledStudents.push(studentId);
    await course.save();
    res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getCourseById = async (req, res) => {
  try {
    // ADDED: .populate('enrolledStudents', 'name email') to fix the attendance list
    const course = await Course.findById(req.params.courseId)
      .populate('instructorId', 'name')
      .populate('enrolledStudents', 'name email');
      
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const getInstructorCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructorId', 'name')
      .populate('enrolledStudents', 'name email'); 
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createCourse, getInstructorCourses, getAllCourses, enrollInCourse, getCourseById, getInstructorCourseDetail };