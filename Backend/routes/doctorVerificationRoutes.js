// =====================================================
// DOCTOR VERIFICATION ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { getApplications, approveApplication, rejectApplication, suspendApplication, removeApplication } = require('../controllers/doctorVerificationController');
const authMiddleware = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.use(authMiddleware);

// All admins can view applications
router.get('/', getApplications);

// Only top executives can approve, reject, suspend, or remove
const execOnly = rbac('CEO', 'COO', 'CTO');
router.put('/:id/approve', execOnly, approveApplication);
router.put('/:id/reject', execOnly, rejectApplication);
router.put('/:id/suspend', execOnly, suspendApplication);
router.delete('/:id/remove', execOnly, removeApplication);

module.exports = router;
