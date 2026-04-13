import mysql from 'mysql2/promise';

async function testConnection() {
    const config = {
        host: '127.0.0.1',
        user: 'root',
        password: 'password123',
        database: 'sir_kp_banting',
        port: 3307,
        connectTimeout: 5000
    };

    console.log('🚀 Starting connection test...');
    try {
        console.log('🔍 Attempting to connect to:', config.host);
        const connection = await mysql.createConnection(config);
        console.log('✅ Connection successful!');

        const [rows] = await connection.execute('SELECT 1 as result');
        console.log('📊 Query result:', rows);

        await connection.end();
        console.log('👋 Connection closed.');
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
    }
}

testConnection().catch(err => {
    console.error('💥 Unhandled Error:', err);
});
