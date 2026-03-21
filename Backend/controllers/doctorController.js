// =====================================================
// DOCTOR CONTROLLER
// Handles listing and filtering active/suspended doctors
// =====================================================

const { pool } = require('../config/db');

// GET /api/doctors
async function getDoctors(req, res) {
    try {
        const { search, status } = req.query;
        
        let query = 'SELECT * FROM doctors WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (full_name LIKE ? OR specialization LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('getDoctors error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { getDoctors };
