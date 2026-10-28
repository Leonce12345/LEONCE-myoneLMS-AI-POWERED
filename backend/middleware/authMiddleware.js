// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// Layer 1 & 2: Authenticate Identity
exports.protect = async(req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerMatch = authorization && authorization.match(/^Bearer\s+(.+)$/i);
    const token = bearerMatch && bearerMatch[1];

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    try {
        // Fetch current user details excluding password to keep req.user fresh
        const currentUser = await Staff.findById(decoded.id).select('-password');
        if (!currentUser) {
            return res.status(401).json({ message: 'User belonging to this token no longer exists' });
        }

        req.user = currentUser;
        return next();
    } catch (error) {
        return next(error);
    }
};

// RBAC Middleware: Authorize Roles
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Role '${req.user ? req.user.role : 'Guest'}' lacks access permission`
            });
        }
        next();
    };
};