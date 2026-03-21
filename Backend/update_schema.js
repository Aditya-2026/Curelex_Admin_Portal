require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        await connection.execute(`ALTER TABLE doctor_applications MODIFY COLUMN status ENUM('Pending', 'Approved', 'Rejected', 'Suspended') DEFAULT 'Pending'`);
        console.log('Schema updated successfully');
        await connection.end();
    } catch (e) {
        console.error('Error updating schema:', e.message);
    }
}

updateSchema();
