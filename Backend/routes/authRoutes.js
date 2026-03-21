// =====================================================
// AUTH ROUTES
// POST /api/auth/login   - Admin login
// GET  /api/auth/me      - Get current user info
// =====================================================

const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


// Public route - no token needed
router.post('/login', login);

// Protected route - requires valid JWT token
router.get('/me', authMiddleware, getMe);


module.exports = router;
