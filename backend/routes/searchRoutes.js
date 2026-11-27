// backend/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) { return res.status(401).json({ error: 'Invalid JWT' }); }
};

// GET: Global Search
router.get('/', verifyToken, async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ users: [], courses: [] });

        // Case-insensitive regex search
        const regex = new RegExp(query, 'i');

        // Search Users (Staff)
        const users = await Staff.find({
            $or: [{ name: regex }, { email: regex }]
        }).select('name email role').limit(5);

        // Search Courses
        const courses = await Course.find({
            $or: [{ title: regex }, { category: regex }]
        }).select('title category instructorId').limit(5);

        res.json({ users, courses });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;