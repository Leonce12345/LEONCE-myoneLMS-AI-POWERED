const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;