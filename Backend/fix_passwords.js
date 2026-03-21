require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixPasswords() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // The correct hash for 'Admin@123' generated with bcryptjs
        const correctHash = '$2b$10$4wZgJDs5CS0FpRm69XRdau1EraMDnMM8GnEgmvDDAdZI54AvfsiZPu';
        
        await connection.execute('UPDATE admin_users SET password = ?', [correctHash]);
        console.log('Fixed all admin passwords to Admin@123');
        await connection.end();
    } catch (e) {
        console.error('Error fixing passwords:', e.message);
    }
}

fixPasswords();
