// =====================================================
// CURELEX ADMIN PORTAL - BACKEND SERVER
// Entry point for the Express application
// Author: Aditya (Backend Development)
// =====================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Enable CORS (allows frontend to call backend APIs)
app.use(cors({
    origin: '*',   // Allow all origins for now (restrict in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// =====================================================
// ROUTES (will be added in upcoming steps)
// =====================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Curelex Admin Portal API is running',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Admin users routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admins', adminRoutes);

// Step 7 - Doctor verification routes
const doctorVerificationRoutes = require('./routes/doctorVerificationRoutes');
app.use('/api/doctor-applications', doctorVerificationRoutes);

// Step 8 - Doctor management routes
const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

// Step 9 - Patient management routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

// Step 10 - Dashboard & Analytics routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);


// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});


// =====================================================
// START SERVER
// =====================================================

async function startServer() {
    // Test database connection first
    await testConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer();
