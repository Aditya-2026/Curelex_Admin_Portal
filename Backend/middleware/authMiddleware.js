// =====================================================
// AUTH MIDDLEWARE - JWT Token Verification
// Protects routes that require authentication
// =====================================================

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Token format: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token format.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
}

module.exports = authMiddleware;
