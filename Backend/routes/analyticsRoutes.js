// =====================================================
// ANALYTICS ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { 
    getGenderDistribution, 
    getAgeDistribution, 
    getPatientGrowth, 
    getDailyVisits, 
    getNewVsReturning,
    getFinancialTrends,
    getSystemHealth
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/gender-distribution', getGenderDistribution);
router.get('/age-distribution', getAgeDistribution);
router.get('/patient-growth', getPatientGrowth);
router.get('/daily-visits', getDailyVisits);
router.get('/new-vs-returning', getNewVsReturning);
router.get('/financial-trends', getFinancialTrends);
router.get('/system-health', getSystemHealth);

module.exports = router;
