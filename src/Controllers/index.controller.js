

const {isDelete, statusBook} = require('../utils/const');
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');


const index = async (request, response) => {

	try {
		var query = `
		SELECT * FROM Customers`;
		const pool = mysql.createPool(configMysql);
		const customers = await pool.query(query);
		await pool.end();
		response.render('Index', {title:'Index', role:'all'})

	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

module.exports = {
    index
}