// =====================================================
// DOCTOR ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { getDoctors } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// View doctors list (all admins)
router.get('/', getDoctors);

module.exports = router;
