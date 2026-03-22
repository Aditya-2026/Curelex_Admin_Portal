// =====================================================
// LOGS ROUTES - Platform Activity & System Logs
// Author: Antigravity - Backend Logic Development
// =====================================================

const express = require('express');
const router = express.Router();
const { getActivityLogsByQuery, getSystemLogs } = require('../controllers/logController');
const authMiddleware = require('../middleware/authMiddleware');

// All log routes require authentication
router.use(authMiddleware);

// Get platform-wide activity logs (Auditing)
router.get('/activity', getActivityLogsByQuery);

// Get basic system-wide logs (Dashboard)
router.get('/system', getSystemLogs);

module.exports = router;
