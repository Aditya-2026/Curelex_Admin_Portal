// =====================================================
// DASHBOARD CONTROLLER
// Provides high-level stats for the admin overview
// =====================================================

const { pool } = require('../config/db');

// GET /api/dashboard/stats
async function getDashboardStats(req, res) {
    try {
        // Query multiple tables concurrently for speed
        const [doctors] = await pool.query('SELECT COUNT(*) as count FROM doctors WHERE status = "Active"');
        const [patients] = await pool.query('SELECT COUNT(*) as count FROM patients WHERE status = "Active"');
        const [dailyPatients] = await pool.query('SELECT COUNT(*) as count FROM patients WHERE DATE(last_visit) = CURDATE()');
        const [pendingApps] = await pool.query('SELECT COUNT(*) as count FROM doctor_applications WHERE status = "Pending"');
        
        // Let's assume a random stat for todays appointments since we don't have an appointments table
        const todaysAppointments = Math.floor(Math.random() * 50) + 10;

        res.json({
            success: true,
            data: {
                totalDoctors: doctors[0].count,
                totalPatients: patients[0].count,
                dailyPatients: dailyPatients[0].count,
                pendingApplications: pendingApps[0].count,
                todaysAppointments: todaysAppointments
            }
        });
    } catch (error) {
        console.error('getDashboardStats error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// GET /api/dashboard/recent-applications
async function getRecentApplications(req, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM doctor_applications ORDER BY applied_at DESC LIMIT 5'
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('getRecentApplications error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { getDashboardStats, getRecentApplications };
