require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL. Creating database...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Database '${process.env.DB_NAME}' created successfully or already exists!`);
        
        await connection.end();
    } catch (e) {
        console.error('❌ Error creating DB:', e.message);
    }
}

createDB();
