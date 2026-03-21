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

// Simulated endpoints for timeline charts (growth, visits)
async function getPatientGrowth(req, res) {
    res.json({
        success: true,
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            values: [3200, 3400, 3550, 3700, 3900, 4050, 4200]
        }
    });
}

async function getDailyVisits(req, res) {
    res.json({
        success: true,
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [310, 280, 350, 420, 390, 180, 120]
        }
    });
}

async function getNewVsReturning(req, res) {
    res.json({
        success: true,
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            newPatients: [85, 72, 110, 95, 130, 142, 158],
            returning: [335, 308, 400, 375, 460, 478, 522]
        }
    });
}

module.exports = {
    getGenderDistribution,
    getAgeDistribution,
    getPatientGrowth,
    getDailyVisits,
    getNewVsReturning
};
