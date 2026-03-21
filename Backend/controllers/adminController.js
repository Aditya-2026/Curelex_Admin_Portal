// =====================================================
// ADMIN USER CONTROLLER
// Handles admin listing and management
// =====================================================

const { pool } = require('../config/db');

// GET /api/admins
// Get all administrative users
async function getAdmins(req, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, full_name, email, role, is_active, created_at FROM admin_users ORDER BY id ASC'
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('getAdmins error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// GET /api/admins/:id
// Get a specific admin
async function getAdminById(req, res) {
    try {
        const adminId = req.params.id;

        const [rows] = await pool.execute(
            'SELECT id, full_name, email, role, is_active, created_at FROM admin_users WHERE id = ?',
            [adminId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('getAdminById error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { getAdmins, getAdminById };
