// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Staff = require('../models/Staff');
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

// GET: Fetch all users to chat with (excluding yourself)
router.get('/contacts', verifyToken, async (req, res) => {
    try {
        const users = await Staff.find({ _id: { $ne: req.user.id } }).select('name role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch chat history with a specific user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); // Sort chronological
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Send a new message
router.post('/', verifyToken, async (req, res) => {
    try {
        const newMessage = new Message({
            sender: req.user.id,
            receiver: req.body.receiver,
            text: req.body.text
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;