const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function applyUpdates() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true // Essential for executing schema.sql
        });

        console.log('Using database:', process.env.DB_NAME);
        await connection.query(`USE ${process.env.DB_NAME}`);

        const schemaFile = path.join(__dirname, 'database', 'schema_v2.sql');
        const schemaSql = fs.readFileSync(schemaFile, 'utf8');

        console.log('Executing schema_v2.sql...');
        await connection.query(schemaSql);

        console.log('✅ Database optimization and new modules schema applied successfully');

    } catch (error) {
        console.error('❌ Error applying updates:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

applyUpdates();
