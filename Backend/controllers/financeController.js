// =====================================================
// FINANCE CONTROLLER - Financial Tracking & Reports
// Author: Antigravity - Backend Logic Development
// =====================================================

const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// GET /api/finance/summary
// Returns current year vs last year revenue summary
async function getFinancialSummary(req, res) {
    try {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        // Query revenue for current vs last year
        const [rows] = await pool.execute(`
            SELECT 
                SUM(CASE WHEN YEAR(transaction_date) = ? AND type = 'Revenue' THEN amount ELSE 0 END) as current_year_revenue,
                SUM(CASE WHEN YEAR(transaction_date) = ? AND type = 'Revenue' THEN amount ELSE 0 END) as last_year_revenue,
                SUM(CASE WHEN YEAR(transaction_date) = ? AND type = 'Expense' THEN amount ELSE 0 END) as current_year_expense,
                SUM(CASE WHEN YEAR(transaction_date) = ? AND type = 'Expense' THEN amount ELSE 0 END) as last_year_expense
            FROM financial_transactions
        `, [currentYear, lastYear, currentYear, lastYear]);

        const summary = rows[0] || {
            current_year_revenue: 0,
            last_year_revenue: 0,
            current_year_expense: 0,
            last_year_expense: 0
        };

        // Calculate growth percentage
        const calculateGrowth = (current, last) => {
            if (!last || last === 0) return current > 0 ? 100 : 0;
            return ((current - last) / last) * 100;
        };

        const revenueGrowth = calculateGrowth(summary.current_year_revenue, summary.last_year_revenue);
        const expenseGrowth = calculateGrowth(summary.current_year_expense, summary.last_year_expense);

        res.json({
            success: true,
            data: {
                revenue: {
                    current: summary.current_year_revenue,
                    last: summary.last_year_revenue,
                    growth: revenueGrowth.toFixed(2)
                },
                expenses: {
                    current: summary.current_year_expense,
                    last: summary.last_year_expense,
                    growth: expenseGrowth.toFixed(2)
                },
                net_profit: (summary.current_year_revenue - summary.current_year_expense).toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error fetching financial summary:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error while fetching financial summary' });
    }
}

// GET /api/finance/revenue-by-month
async function getRevenueByMonth(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                MONTHNAME(transaction_date) as month,
                SUM(amount) as revenue
            FROM financial_transactions
            WHERE type = 'Revenue' AND YEAR(transaction_date) = YEAR(CURRENT_DATE())
            GROUP BY MONTH(transaction_date)
            ORDER BY MONTH(transaction_date)
        `);

        // Map to format for Charts
        const labels = rows.map(r => r.month);
        const values = rows.map(r => r.revenue);

        res.json({ success: true, data: { labels, values } });
    } catch (error) {
        console.error('Error fetching monthly revenue:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// GET /api/finance/revenue-by-category
async function getRevenueByCategory(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                category as label,
                SUM(amount) as value
            FROM financial_transactions
            WHERE type = 'Revenue'
            GROUP BY category
            ORDER BY value DESC
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching revenue by category:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// POST /api/finance/transaction
// Securely records a new financial transaction
async function recordTransaction(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, category, amount, description, reference_id, transaction_date } = req.body;
    const recorded_by = req.user.id; // Logged-in admin

    try {
        const [result] = await pool.execute(`
            INSERT INTO financial_transactions 
            (type, category, amount, description, reference_id, recorded_by, transaction_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [type, category, amount, description || null, reference_id || null, recorded_by, transaction_date || new Date()]);

        res.status(201).json({
            success: true,
            message: 'Transaction recorded successfully',
            transactionId: result.insertId
        });

    } catch (error) {
        console.error('Error recording transaction:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error while recording transaction' });
    }
}

module.exports = {
    getFinancialSummary,
    getRevenueByMonth,
    getRevenueByCategory,
    recordTransaction
};
