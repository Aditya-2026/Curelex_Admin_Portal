// =====================================================
// ANALYTICS CONTROLLER
// Provides data for frontend Chart.js components
// Note: Some data is aggregated via group by, some simulated based on DB counts
// =====================================================

const { pool } = require('../config/db');

// GET /api/analytics/gender-distribution
async function getGenderDistribution(req, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT gender as label, COUNT(*) as count FROM patients WHERE gender IS NOT NULL GROUP BY gender'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// GET /api/analytics/age-distribution
async function getAgeDistribution(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                CASE 
                    WHEN age < 18 THEN '0-17'
                    WHEN age BETWEEN 18 AND 34 THEN '18-34'
                    WHEN age BETWEEN 35 AND 54 THEN '35-54'
                    WHEN age BETWEEN 55 AND 74 THEN '55-74'
                    ELSE '75+'
                END as label,
                COUNT(*) as count
            FROM patients
            WHERE age IS NOT NULL
            GROUP BY label
            ORDER BY MIN(age)
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// GET /api/analytics/financial-trends
async function getFinancialTrends(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(transaction_date, '%Y-%m') as label,
                SUM(CASE WHEN type = 'Revenue' THEN amount ELSE 0 END) as revenue,
                SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expenses
            FROM financial_transactions
            WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY label
            ORDER BY label
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching financial trends:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error while fetching trends' });
    }
}

// GET /api/analytics/system-health
async function getSystemHealth(req, res) {
    try {
        // In a real scenario, this would check real server metrics or fetch from a metrics table
        // For now, we simulate but use the database connection as a real check
        const connectionCheck = await pool.getConnection();
        connectionCheck.release();

        const [userCounts] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM patients WHERE status = 'Active') as active_patients,
                (SELECT COUNT(*) FROM doctors WHERE status = 'Active') as active_doctors,
                (SELECT COUNT(*) FROM admin_users WHERE is_active = TRUE) as active_admins
        `);

        res.json({
            success: true,
            data: {
                status: 'Healthy',
                uptime: process.uptime(),
                database: 'Connected',
                active_users: userCounts[0],
                server_time: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'System health check failed',
            error: error.message
        });
    }
}

// Simulated endpoints for timeline charts (growth, visits)
async function getPatientGrowth(req, res) {
    try {
        // Real query to get patient growth per month
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as label,
                COUNT(*) as count
            FROM patients
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY MONTH(created_at)
            ORDER BY created_at
        `);

        if (rows.length === 0) {
            // Return simulation if no data
            return res.json({
                success: true,
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    values: [3200, 3400, 3550, 3700, 3900, 4050, 4200]
                }
            });
        }

        res.json({
            success: true,
            data: {
                labels: rows.map(r => r.label),
                values: rows.map(r => r.count)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getDailyVisits(req, res) {
    // This would typically query an appointments table, but since we don't have it in the schema, 
    // we use simulation for now or base it on a generic visit log if available.
    res.json({
        success: true,
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [310, 280, 350, 420, 390, 180, 120]
        }
    });
}

async function getNewVsReturning(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as label,
                SUM(CASE WHEN is_new_patient = TRUE THEN 1 ELSE 0 END) as newPatients,
                SUM(CASE WHEN is_new_patient = FALSE THEN 1 ELSE 0 END) as returning
            FROM patients
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY MONTH(created_at)
            ORDER BY created_at
        `);

        if (rows.length === 0) {
            return res.json({
                success: true,
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    newPatients: [85, 72, 110, 95, 130, 142, 158],
                    returning: [335, 308, 400, 375, 460, 478, 522]
                }
            });
        }

        res.json({
            success: true,
            data: {
                labels: rows.map(r => r.label),
                newPatients: rows.map(r => r.newPatients),
                returning: rows.map(r => r.returning)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    getGenderDistribution,
    getAgeDistribution,
    getPatientGrowth,
    getDailyVisits,
    getNewVsReturning,
    getFinancialTrends,
    getSystemHealth
};
