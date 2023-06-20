const { isDelete, statusRoom, statusBook, rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const {verifiedToken} = require('../Helpers/validateToken.helper')


const getBook = async (request, response) => {
		
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
		response.render('Booking', {
			title : 'Bookings', 
			layout:'layout',
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

const getAllBook = async (request, response) =>{

	try {
			var queryBooks = `SELECT main.id,  cus.fullname, 
			roo.roomname , pay.paymentname  , main.checkindate, 
			main.checkoutdate, main.totalmoney, sta.statusname 
			FROM Books main 
			LEFT JOIN Bookdetails det ON (main.id = det.bookid) 
			LEFT JOIN Rooms roo ON (main.roomid = roo.id)
			LEFT JOIN Payments pay ON (main.paymentid = pay.id)
			LEFT JOIN Customers cus ON (det.customerid = cus.id)
			LEFT JOIN RoomServiceDetails rod ON (main.id = rod.bookid)
			LEFT JOIN RoomServices ros ON (rod.roomserviceid = ros.id)
			LEFT JOIN Statuss sta ON (sta.id = main.statusbook)
			WHERE det.id = 1  AND main.isDelete = ${isDelete.false}  
			ORDER BY main.id ASC
			`; 
			const pool = mysql.createPool(configMysql);
			var books = await pool.query(queryBooks);
			books = books[0];
			await pool.end();			
			response.json({
				book: books,
				success: true, 
				rowInPage: rowInPage
			});
			
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}
const getBookById = async (request, response) =>{

	try {
		const {id} = request.params;
	
		const queryBook = `
		SELECT main.*, roo.roomname, bde.*, rot.*, pay.paymentname 
		FROM Books main
		LEFT JOIN Rooms roo on (main.roomid = roo.id)
		LEFT JOIN Payments pay on (main.paymentid = pay.id)
		LEFT JOIN BookDetails bde on (main.id = bde.bookid)
		LEFT JOIN RoomTypes rot ON (roo.roomtype = rot.id)
		WHERE main.id = ? AND main.isDelete = ?
		AND main.statusBook = ? AND bde.id = 1
		ORDER BY main.id ASC
		`;
		const queryBookDetail = `
		SELECT main.*, cus.fullname, 
		cus.citizenIdentityCard, cut.customertypename FROM BookDetails main
		LEFT JOIN Customers cus on (main.customerid = cus.id)
		LEFT JOIN Customertypes cut on (cus.customertype = cut.id)
		WHERE main.bookid =${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;

		const queryRoomServiceDetail = `
		SELECT main.roomserviceid, main.quantity FROM RoomServiceDetails main
		LEFT JOIN RoomServices roo on (main.roomserviceid = roo.id)
		WHERE main.bookid = ${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBook, [id, isDelete.false, statusBook.CHUATHANHTOAN]);
		books = books[0];		
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
		const bookdetail = await pool.query(queryBookDetail);
		const roomservicedetail = await pool.query(queryRoomServiceDetail);
		await pool.end();
		console.log(books)
		response.json({
			book: books, 
			bookdetail: bookdetail[0],
			roomservicedetail: roomservicedetail[0],
			success: true
		})
		
	
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}


module.exports = {
    getBookById, getAllBook,  getBook
};

