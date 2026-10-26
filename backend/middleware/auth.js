const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader);

        if(!authHeader) {
            return res.status(401).json({ message: '❌ No token, access denied!'});
        }

        // Remove Bearer prefix
        const token = authHeader.startsWith('Bearer')
            ? authHeader.slice(7)
            : authHeader;
        
        console.log('Token extracted:', token);

        if (!token) {
            return res.status(401).json({ message: '❌ No token, access denied!'});
        }

        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: '❌ Invalid token!' });
    }
};

module.exports = authMiddleware;