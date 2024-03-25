const mysql = require('mysql');

/* let connection;

const createConnection = () => {
    connection = mysql.createConnection({
        host: 'bafcijlexjbxurfudhmn-mysql.services.clever-cloud.com',
        user: 'uhksps9hx87hd32a',
        password: '0f2tFcor3I2V3AmFbF5f',
        database: 'bafcijlexjbxurfudhmn'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos: ' + err.stack);
            setTimeout(createConnection, 2000); // Intentar reconectar después de un breve intervalo
        } else {
            console.log('Base de datos MySQL conectada');
        }
    });

    connection.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('La conexión a la base de datos MySQL perdida. Reconectando...');
            createConnection();
        } else {
            throw err; // Manejar otros errores de conexión
        }
    });
};

createConnection(); */

const pool = mysql.createPool({
    connectionLimit: 50,
    host: 'bafcijlexjbxurfudhmn-mysql.services.clever-cloud.com',
    user: 'uhksps9hx87hd32a',
    password: '0f2tFcor3I2V3AmFbF5f',
    database: 'bafcijlexjbxurfudhmn'
});

module.exports = pool;