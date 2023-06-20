require('dotenv').config()
const mysql = require('mysql2/promise');

const setDB = {
    server: 'localhost',
    id: 'root',
    password: 'Duchoai681991@',
    name: 'qlkhachsan'
}

module.exports = configMysql =  {

    host: process.env.DB_SERVER || setDB.server ,
    user: process.env.DB_ID || setDB.id,
    password: process.env.DB_PASSWORD || setDB.password,
    database: process.env.DB_NAME || setDB.name,
    connectionLimit: 10

}