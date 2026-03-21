// =====================================================
// ADMIN ROUTES
// GET /api/admins       - List all admins
// GET /api/admins/:id   - Get specific admin
// =====================================================

const express = require('express');
const router = express.Router();
const { getAdmins, getAdminById } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

// All admin routes require authentication and specific roles (e.g. CEO/COO/CTO/HR)
// For now, restricting the whole list viewing to top execs and HR
router.use(authMiddleware);

// Restrict to top management
router.get('/', rbac('CEO', 'COO', 'CTO', 'CHRO'), getAdmins);
router.get('/:id', rbac('CEO', 'COO', 'CTO', 'CHRO'), getAdminById);

module.exports = router;
