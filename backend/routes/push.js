const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Subscription = require('../models/Subscription');

// Send the public key to the frontend 
router.get('/public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Save a device subscription 
router.post('/subscribe', authMiddleware, async (req, res) => {
    try {
        const { endpoint, keys } = req.body;
        await Subscription.findOneAndUpdate(
            { endpoint },
            { userId: req.userId, endpoint, keys },
            { upsert: true, new: true }  
        );
        res.status(201).json({ message: 'Subscribed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/complete', async (req, res) => {
    try {
        const { actionToken } = req.body;
        const decoded = jwt.verify(actionToken, process.env.JWT_SECRET);
        await Task.findOneAndUpdate(
            { _id: decoded.taskId, userId: decoded.userId },
            { completed: true}
        );
        res.json({ message: 'Completed' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token'});
    }
});

module.exports = router;