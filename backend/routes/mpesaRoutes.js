const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateToken } = require('../middleware/mpesaAuth');
const { stkPush, stkCallback } = require('../controllers/mpesaController');

router.post('/stkpush', protect, generateToken, stkPush);
router.post('/callback', stkCallback);

module.exports = router;