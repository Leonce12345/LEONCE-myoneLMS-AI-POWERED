const express = require('express');
const router = express.Router();
const { askAI, generalChat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST route for asking a question based on course PDFs
router.post('/ask', protect, askAI);

// POST route for the general dashboard AI cards
router.post('/general-chat', protect, generalChat);

module.exports = router;