// =====================================================
// PATIENT CONTROLLER
// Handles listing and filtering patients
// =====================================================

const { pool } = require('../config/db');

// GET /api/patients
async function getPatients(req, res) {
    try {
        const { search } = req.query;
        
        let query = 'SELECT id, full_name, age, gender, last_visit, status, is_new_patient FROM patients WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (full_name LIKE ? OR status LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY last_visit DESC';

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('getPatients error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { getPatients };
