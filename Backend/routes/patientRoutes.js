// =====================================================
// PATIENT ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { getPatients } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// View patients list (all admins)
router.get('/', getPatients);

module.exports = router;
