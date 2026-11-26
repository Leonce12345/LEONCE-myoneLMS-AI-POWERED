const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST route for asking a question
router.post('/ask', protect, askAI);

module.exports = router;