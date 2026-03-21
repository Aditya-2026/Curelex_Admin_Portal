// =====================================================
// DATABASE CONNECTION - MySQL2 Connection Pool
// =====================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (reuses connections efficiently)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = { pool, testConnection };
