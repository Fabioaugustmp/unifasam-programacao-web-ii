import mysql from 'mysql2/promise'

export const pool =  mysql.createPool({
    host: localhost,
    port: 3306,
    user: root,
    password: root123,
    database: flowdesk,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z'
});

export async function checkDatabaseConnection() {
    await pool.execute('SELECT 1');
    
}