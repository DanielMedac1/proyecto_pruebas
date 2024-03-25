const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 50,
    host: 'bafcijlexjbxurfudhmn-mysql.services.clever-cloud.com',
    user: 'uhksps9hx87hd32a',
    password: '0f2tFcor3I2V3AmFbF5f',
    database: 'bafcijlexjbxurfudhmn'
});

module.exports = pool;