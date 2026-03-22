// =====================================================
// FINANCE ROUTES - Financial Tracking & Reports
// Author: Antigravity - Backend Logic Development
// =====================================================

const express = require('express');
const router = express.Router();
const { body } = require('express-validator' );
const { 
    getFinancialSummary, 
    getRevenueByMonth, 
    getRevenueByCategory, 
    recordTransaction 
} = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');

// Validations for recording transactions
const transactionValidation = [
    body('type').isIn(['Revenue', 'Expense']).withMessage('Type must be either Revenue or Expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isNumeric().withMessage('Amount must be a numeric value').toFloat(),
];

// All finance routes require authentication
router.use(authMiddleware);

// Get overall financial health summary
router.get('/summary', getFinancialSummary);

// Get revenue data for monthly trend charts
router.get('/revenue-trend', getRevenueByMonth);

// Get revenue distribution for pie/doughnut charts
router.get('/revenue-distribution', getRevenueByCategory);

// Securely record a new financial transaction
router.post('/transaction', transactionValidation, recordTransaction);

module.exports = router;
