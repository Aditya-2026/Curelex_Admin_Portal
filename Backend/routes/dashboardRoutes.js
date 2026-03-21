// =====================================================
// DASHBOARD ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentApplications } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/recent-applications', getRecentApplications);

module.exports = router;
