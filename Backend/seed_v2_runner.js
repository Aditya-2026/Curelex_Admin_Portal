const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedV2() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Reading seed_v2.sql...');
        const seedSql = fs.readFileSync(path.join(__dirname, 'database', 'seed_v2.sql'), 'utf8');

        console.log('Seeding Database V2...');
        await connection.query(seedSql);

        console.log('✅ Seed Data V2 applied successfully (Financial & Activity Data)');

    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedV2();
