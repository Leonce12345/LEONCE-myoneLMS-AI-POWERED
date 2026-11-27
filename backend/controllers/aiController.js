const CourseChunk = require('../models/CourseChunk');
const Course = require('../models/Course'); 
const Result = require('../models/Result'); 
const Staff = require('../models/Staff'); 
const Transaction = require('../models/Transaction'); 
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// 1. Course-Specific RAG Chat (For Students inside a course)
const askAI = async (req, res) => {
  try {
    const { courseId, question } = req.body;

    if (!courseId || !question) {
      return res.status(400).json({ message: 'Course ID and question are required.' });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryVector = embeddingResponse.data[0].embedding;

    const relevantChunks = await CourseChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", 
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 10,
          limit: 3,
          filter: { courseId: { $eq: courseId } } 
        }
      }
    ]);

    console.log(`Vector Search found ${relevantChunks.length} chunks for the query: "${question}"`);

    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

    if (!context) {
        return res.status(200).json({ answer: "I couldn't find any relevant information in the course materials to answer that question." });
    }

    const llmResponse = await openai.chat.completions.create({
      model: "openrouter/free", 
      messages: [
        {
          role: "system",
          content: `You are a helpful teaching assistant. Answer the user's question based ONLY on the provided context. Do not use outside knowledge.\n\nContext:\n${context}`
        },
        { role: "user", content: question }
      ],
      temperature: 0.3, 
    });

    res.status(200).json({ answer: llmResponse.choices[0].message.content });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ message: 'Failed to generate an answer.' });
  }
};

// 2. Context-Aware General Dashboard Chat
const generalChat = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required.' });

    const userId = req.user.id || req.user._id; 
    const userRole = req.user.role;
    let contextData = "";

    // Fetch real data based on who is asking
    if (userRole === 'student') {
      const enrolledCourses = await Course.find({ enrolledStudents: userId }).select('title description');
      const results = await Result.find({ studentId: userId }).populate('courseId', 'title');
      
      const courseNames = enrolledCourses.map(c => c.title).join(', ') || "None";
      const grades = results.map(r => `${r.courseId?.title}: ${r.grade} (${r.score}%)`).join(', ') || "No grades yet";
      
      contextData = `The user is a Student. Their enrolled courses are: ${courseNames}. Their current grades are: ${grades}.`;
    } 
    else if (userRole === 'admin') {
      const totalStudents = await Staff.countDocuments({ role: 'student' });
      const totalCourses = await Course.countDocuments();
      const revenue = await Transaction.aggregate([{ $match: { resultCode: 0 } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
      const totalRev = revenue.length > 0 ? revenue[0].total : 0;
      
      contextData = `The user is an Admin. Platform Stats -> Total Students: ${totalStudents}, Total Courses: ${totalCourses}, Total Revenue: KES ${totalRev}.`;
    } 
    else {
      const myCourses = await Course.find({ instructorId: userId }).select('title');
      contextData = `The user is an Instructor. Their created courses are: ${myCourses.map(c => c.title).join(', ')}.`;
    }

    const llmResponse = await openai.chat.completions.create({
      model: "openrouter/free", 
      messages: [
        {
          role: "system",
          content: `You are a smart AI assistant for LearnHub LMS. Here is the current context about the user and the platform:\n\n${contextData}\n\nUse this context to answer the user's questions accurately. If they ask about their courses, grades, or platform stats, refer to the context above. Be concise and helpful.`
        },
        { role: "user", content: question }
      ],
      temperature: 0.5, 
    });

    res.status(200).json({ answer: llmResponse.choices[0].message.content });
  } catch (error) {
    console.error("General AI Error:", error);
    res.status(500).json({ message: 'Failed to generate an answer.' });
  }
};

module.exports = { askAI, generalChat };