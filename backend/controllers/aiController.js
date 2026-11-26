const CourseChunk = require('../models/CourseChunk');
const { OpenAI } = require('openai');

// Use the same OpenRouter client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const askAI = async (req, res) => {
  try {
    const { courseId, question } = req.body;

    if (!courseId || !question) {
      return res.status(400).json({ message: 'Course ID and question are required.' });
    }

    // 1. Convert the student's question into an embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryVector = embeddingResponse.data[0].embedding;

    // 2. Perform Vector Search in MongoDB Atlas
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

    // 3. Combine the text from the relevant chunks into a single context string
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

    if (!context) {
        return res.status(200).json({ answer: "I couldn't find any relevant information in the course materials to answer that question." });
    }

    // 4. Call the LLM with the context and the question
    const llmResponse = await openai.chat.completions.create({
      // Using OpenRouter's Free Models Router for lasting reliability
      model: "openrouter/free", 
      messages: [
        {
          role: "system",
          content: `You are a helpful teaching assistant. Answer the user's question based ONLY on the provided context. Do not use outside knowledge. If the answer is not in the context, say that you don't know.\n\nContext:\n${context}`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.3, 
    });

    const answer = llmResponse.choices[0].message.content;

    // 5. Send the answer back to the frontend
    res.status(200).json({ answer });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ message: 'Failed to generate an answer.' });
  }
};

module.exports = { askAI };