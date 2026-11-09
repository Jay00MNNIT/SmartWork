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

module.exports = router;