const { isDelete, statusRoom, statusBook, rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');

const getBookingByStaff = async (request, response) => {
		
	try {		
		const pool = mysql.createPool(configMysql);

		var roomtypes = await pool.query(`SELECT main.*,
		 roo.price, roo.maxcustomer, roo.roomtypename
		FROM Rooms main 
		LEFT JOIN Roomtypes roo ON (main.roomtype = roo.id)
		WHERE main.isDelete = ${isDelete.false}  ORDER BY main.id ASC`);
		const pages = Math.ceil(roomtypes[0].length/rowInPage);
		const lastPage = Math.ceil(roomtypes[0].length/rowInPage);
		await pool.end();
		response.render('Bookingstaff', {
			title : 'Bookings', 
			layout:'layoutstaff',
			data: roomtypes[0],
			pages: pages,
			current: 1, 
			firstPage: 1,
			lastPage: lastPage,
			rowInPage: rowInPage
		});
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}	
}


module.exports = {
	getBookingByStaff
};

