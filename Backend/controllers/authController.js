// =====================================================
// AUTH CONTROLLER - Login Logic
// Handles admin authentication with JWT
// =====================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');


// POST /api/auth/login
async function login(req, res) {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin user by email
        const [rows] = await pool.execute(
            'SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const admin = rows[0];

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                full_name: admin.full_name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Log the login action
        await pool.execute(
            'INSERT INTO system_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [admin.id, 'LOGIN', `${admin.full_name} (${admin.role}) logged in`, req.ip]
        );

        // Send response (without password)
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: admin.id,
                    full_name: admin.full_name,
                    email: admin.email,
                    role: admin.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


// GET /api/auth/me - Get current logged-in user info
async function getMe(req, res) {

    try {
        const [rows] = await pool.execute(
            'SELECT id, full_name, email, role, is_active, created_at FROM admin_users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('GetMe error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


module.exports = { login, getMe };
