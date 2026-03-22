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
        
        // Add financial overview
        const [revenue] = await pool.query(`
            SELECT 
                SUM(CASE WHEN type = 'Revenue' THEN amount ELSE 0 END) as totalRevenue,
                SUM(CASE WHEN type = 'Revenue' AND MONTH(transaction_date) = MONTH(CURRENT_DATE()) AND YEAR(transaction_date) = YEAR(CURRENT_DATE()) THEN amount ELSE 0 END) as monthlyRevenue
            FROM financial_transactions
        `);

        res.json({
            success: true,
            data: {
                totalDoctors: doctors[0].count,
                totalPatients: patients[0].count,
                dailyPatients: dailyPatients[0].count,
                pendingApplications: pendingApps[0].count,
                totalRevenue: revenue[0].totalRevenue || 0,
                monthlyRevenue: revenue[0].monthlyRevenue || 0
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
