const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateToken } = require('../middleware/mpesaAuth');
const { stkPush, stkCallback } = require('../controllers/mpesaController');
const Transaction = require('../models/Transaction');

router.post('/stkpush', protect, generateToken, stkPush);
router.post('/callback', stkCallback);

// NEW ROUTE: Check if a student has paid for a specific course
router.get('/status/:studentId/:courseId', protect, async (req, res) => {
  try {
    // Get the LATEST transaction for this student and course
    const transaction = await Transaction.findOne({ 
      studentId: req.params.studentId, 
      courseId: req.params.courseId
    }).sort({ createdAt: -1 });
    
    console.log(`[STATUS CHECK] Student: ${req.params.studentId}, Course: ${req.params.courseId}`);
    console.log(`[STATUS CHECK] Found Transaction:`, transaction ? { code: transaction.resultCode, desc: transaction.resultDesc } : 'None');

    if (transaction && transaction.resultCode === 0) {
      res.status(200).json({ paid: true, receipt: transaction.mpesaReceiptNumber });
    } else {
      res.status(200).json({ paid: false, reason: transaction ? transaction.resultDesc : 'No transaction found' });
    }
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: 'Error checking payment status' });
  }
});

module.exports = router;