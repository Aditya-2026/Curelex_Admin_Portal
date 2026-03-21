require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seedDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Connected. Running schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        await connection.query(schema);

        console.log('Running seed.sql...');
        const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
        await connection.query(seed);

        console.log('Database seeded successfully!');
        await connection.end();
    } catch (e) {
        console.error('Error seeding DB:', e.message);
    }
}

seedDB();
