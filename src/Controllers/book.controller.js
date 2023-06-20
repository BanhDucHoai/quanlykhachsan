const { isDelete, statusRoom, statusBook, rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const {verifiedToken, verifiedTokenByStaff} = require('../Helpers/validateToken.helper')


const queryRoomServiceDetailByBookid =
	`SELECT bookid, id, roomserviceid 
	FROM RoomServiceDetails 
	WHERE bookid = ? `;

const queryBookDetailByBookid =
	`SELECT bookid, id, customerid 
	FROM BookDetails 
	WHERE bookid = ? `;

const getBook = async (request, response) => {
		
	response.render('Book', {title : 'Books'})
}



const getAllBook = async (request, response) =>{
	
	try {
			var queryBooks = `SELECT main.id,  cus.fullname, 
			roo.roomname , main.statusBook, pay.paymentname  , main.checkindate, 
			main.checkoutdate, main.totalmoney, sta.statusname
			FROM Books main 
			LEFT JOIN Bookdetails det ON (main.id = det.bookid) 
			LEFT JOIN Rooms roo ON (main.roomid = roo.id)
			LEFT JOIN Payments pay ON (main.paymentid = pay.id)
			LEFT JOIN Customers cus ON (det.customerid = cus.id)
			LEFT JOIN Statuss sta ON (sta.id = main.statusbook)
			
			WHERE det.id = 1  
			AND main.isDelete = ${isDelete.false}  
			ORDER BY  main.checkindate DESC
			`; 


			const pool = mysql.createPool(configMysql);
			var books = await pool.query(queryBooks);
			
			books = books[0];
			
			for( let i = 0; i <books.length; i++ ) {
				books[i].checkindate = books[i].checkindate.toLocaleString();
				books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
			}
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

const getAllBookByStaff = async (request, response) =>{
	
	try {
		
		var queryBooks = `SELECT main.id,  cus.fullname, 
		roo.roomname , main.statusBook, pay.paymentname , 
		main.checkindate, staff.username,
		main.checkoutdate, main.totalmoney, sta.statusname 
		FROM Books main 
		LEFT JOIN Bookdetails det ON (main.id = det.bookid) 
		LEFT JOIN Rooms roo ON (main.roomid = roo.id)
		LEFT JOIN Payments pay ON (main.paymentid = pay.id)
		LEFT JOIN Customers cus ON (det.customerid = cus.id)
		LEFT JOIN Statuss sta ON (sta.id = main.statusbook)	
		LEFT JOIN Staffs staff ON (main.staffid = staff.id)	
		WHERE det.id = 1  		
		AND main.isDelete = ?  
		ORDER BY main.checkindate DESC
		`; 
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBooks, [ isDelete.false]);
		books = books[0];
			
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
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


const getBookByIdFromTo = async (request, response) =>{
	
	try {
		const {id, rowinpage} = request.params;
		
			var queryBooks = `SELECT main.id,  cus.fullname, 
			roo.roomname , main.statusBook, pay.paymentname  , main.checkindate, 
			main.checkoutdate, main.totalmoney, sta.statusname , staff.username
			FROM Books main 
			LEFT JOIN Bookdetails det ON (main.id = det.bookid) 
			LEFT JOIN Rooms roo ON (main.roomid = roo.id)
			LEFT JOIN Payments pay ON (main.paymentid = pay.id)
			LEFT JOIN Customers cus ON (det.customerid = cus.id)
			LEFT JOIN Statuss sta ON (sta.id = main.statusbook)
			
			LEFT JOIN Staffs staff ON (main.staffid = staff.id)	
			WHERE det.id = 1  AND main.isDelete = ${isDelete.false}  
			ORDER BY  main.checkindate DESC
			LIMIT ? , ?
			`; 
			const pool = mysql.createPool(configMysql);
			var books = await pool.query(queryBooks, [parseInt(id), parseInt(rowinpage)]);
			books = books[0];
			
			for( let i = 0; i <books.length; i++ ) {
				books[i].checkindate = books[i].checkindate.toLocaleString();
				books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
			}
			await pool.end();			
			response.json({
				book: books,
				success: true
			});
			
		
	} catch (error) {
		
		response.json({
			message: error.message,
			success: false
		})
	}
}

const getBookByIdFromToByStaff = async (request, response) =>{

	try {
		

		const {id, rowinpage} = request.params;
		
			var queryBooks = `SELECT main.id,  cus.fullname, 
			roo.roomname , main.statusBook, 
			pay.paymentname  , main.checkindate, 
			main.checkoutdate, main.totalmoney, sta.statusname 
			FROM Books main 
			LEFT JOIN Bookdetails det ON (main.id = det.bookid) 
			LEFT JOIN Rooms roo ON (main.roomid = roo.id)
			LEFT JOIN Payments pay ON (main.paymentid = pay.id)
			LEFT JOIN Customers cus ON (det.customerid = cus.id)
			LEFT JOIN Statuss sta ON (sta.id = main.statusbook)
			WHERE det.id = 1  
			
			AND main.isDelete = ? 
			ORDER BY main.checkindate DESC
			LIMIT ? , ?
			`; 
			const pool = mysql.createPool(configMysql);
			var books = await pool.query(queryBooks, [ isDelete.false, parseInt(id), parseInt(rowinpage)]);
			books = books[0];
			
			for( let i = 0; i <books.length; i++ ) {
				books[i].checkindate = books[i].checkindate.toLocaleString();
				books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
			}
			await pool.end();			
			response.json({
				book: books,
				success: true
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
		SELECT main.*, roo.roomname, bde.*, rot.*, 
		pay.paymentname, sta.statusname, 
		staf.username
		FROM Books main
		LEFT JOIN Rooms roo on (main.roomid = roo.id)
		LEFT JOIN Payments pay on (main.paymentid = pay.id)
		LEFT JOIN BookDetails bde on (main.id = bde.bookid)
		LEFT JOIN RoomTypes rot ON (roo.roomtype = rot.id)
		LEFT JOIN Statuss sta on (main.StatusBook = sta.id)
		LEFT JOIN Staffs staf on (main.staffid = staf.id)
		
		WHERE main.id = ? AND main.isDelete = ?
		AND bde.id = 1
		ORDER BY main.id ASC
		`;
		const queryBookDetail = `
		SELECT main.*, cus.fullname,  cus.citizenIdentityCard, cut.customertypename 
		FROM BookDetails main
		LEFT JOIN Customers cus on (main.customerid = cus.id)
		LEFT JOIN Customertypes cut on (cus.customertype = cut.id)
		WHERE main.bookid =${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;

		const queryRoomServiceDetail = `
		SELECT main.roomserviceid, roo.roomservicename, roo.price, main.quantity 
		FROM RoomServiceDetails main
		LEFT JOIN RoomServices roo on (main.roomserviceid = roo.id)
		WHERE main.bookid = ${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBook, [id, isDelete.false]);

		const bookdetail = await pool.query(queryBookDetail);
		const roomservicedetail = await pool.query(queryRoomServiceDetail);
		await pool.end();
		books = books[0];		
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
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

const getBookByIdAndStaff = async (request, response) =>{
	
	try {
		const {id} = request.params;
			
	
		const queryBook = `
		SELECT main.*, roo.roomname, bde.*, rot.*, 
		pay.paymentname, sta.statusname,
		staf.username
		FROM Books main
		LEFT JOIN Rooms roo on (main.roomid = roo.id)
		LEFT JOIN Payments pay on (main.paymentid = pay.id)
		LEFT JOIN BookDetails bde on (main.id = bde.bookid)
		LEFT JOIN RoomTypes rot ON (roo.roomtype = rot.id)
		LEFT JOIN Statuss sta on (main.StatusBook = sta.id)
		LEFT JOIN Staffs staf on (main.staffid = staf.id)
		WHERE main.id = ? 
		
		AND main.isDelete = ?
		AND bde.id = 1
		ORDER BY main.id ASC
		`;
		const queryBookDetail = `
		SELECT main.*, cus.fullname,  cus.citizenIdentityCard, cut.customertypename 
		FROM BookDetails main
		LEFT JOIN Customers cus on (main.customerid = cus.id)
		LEFT JOIN Customertypes cut on (cus.customertype = cut.id)
		WHERE main.bookid =${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;

		const queryRoomServiceDetail = `
		SELECT main.roomserviceid, roo.roomservicename, roo.price, main.quantity 
		FROM RoomServiceDetails main
		LEFT JOIN RoomServices roo on (main.roomserviceid = roo.id)
		WHERE main.bookid = ${id} AND main.isDelete = ${isDelete.false} 
		ORDER BY main.id ASC
		`;
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBook, [id,  isDelete.false]);

		const bookdetail = await pool.query(queryBookDetail);
		const roomservicedetail = await pool.query(queryRoomServiceDetail);
		await pool.end();
		books = books[0];		
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
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

const searchBook = async (request, response) =>{

	try {
		const {search} = request.body;
		
		const queryBook = `
		SELECT main.id,  cus.fullname, 
		roo.roomname , main.statusBook, pay.paymentname  , main.checkindate, 
		main.checkoutdate, main.totalmoney, sta.statusname
		FROM Books main
		LEFT JOIN Rooms roo on (main.roomid = roo.id)
		LEFT JOIN Payments pay on (main.paymentid = pay.id)
		LEFT JOIN BookDetails bde on (main.id = bde.bookid)
		LEFT JOIN Customers cus on (bde.customerid = cus.id)
		LEFT JOIN RoomTypes rot ON (roo.roomtype = rot.id)
		LEFT JOIN Statuss sta on (main.StatusBook = sta.id)
		
		WHERE  main.isDelete = ?
		AND bde.id = 1  ` +  ` ORDER BY  main.checkindate DESC `;
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBook,[isDelete.false]);
				
		await pool.end();
		books = books[0];		
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
		
		response.json({
			data: books, 
			success: true, 
			rowInPage: rowInPage
		})
		
	
	} catch (error) {
		
		response.json({
			message: error.message,
			success: false
		})
	}
}

const searchBookByStaff = async (request, response) =>{

	try {
		

		const {search} = request.body;
		var searchWith = '';
		if(search !== '') {
			searchWith = `AND  cus.fullname LIKE '%${search}%'  `;
		}
		const queryBook = `
		SELECT main.id,  cus.fullname, 
		roo.roomname , main.statusBook, pay.paymentname  , 
		main.checkindate, staf.username,
		main.checkoutdate, main.totalmoney, sta.statusname
		FROM Books main
		LEFT JOIN Rooms roo on (main.roomid = roo.id)
		LEFT JOIN Payments pay on (main.paymentid = pay.id)
		LEFT JOIN BookDetails bde on (main.id = bde.bookid)
		LEFT JOIN Customers cus on (bde.customerid = cus.id)
		LEFT JOIN RoomTypes rot ON (roo.roomtype = rot.id)
		LEFT JOIN Statuss sta on (main.StatusBook = sta.id)
		LEFT JOIN Staffs staf on (main.staffid = staf.id)
		WHERE main.isDelete = ? 
		
		AND bde.id = 1 ` + searchWith + ` ORDER BY main.checkindate DESC `;
		const pool = mysql.createPool(configMysql);
		var books = await pool.query(queryBook,[isDelete.false]);
				
		await pool.end();
		books = books[0];		
		for( let i = 0; i <books.length; i++ ) {
			books[i].checkindate = books[i].checkindate.toLocaleString();
			books[i].checkoutdate = books[i].checkoutdate.toLocaleString();
		}
		
		response.json({
			data: books, 
			success: true, 
			rowInPage: rowInPage
		})
		
	
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const postBook = async (request, response) =>{

	try {		
		const staffid = verifiedTokenByStaff(request).id
		
		var { roomid, paymentid, customerid, 
			roomserviceid, quantityTemp,  checkoutdate, totalmoney, checkindateText} 
			= request.body;
		
		if(!(customerid && customerid.length >0)) {
			response.json({
				message: "Error",
				success: false
			})
			return;
		}		
		const pool = mysql.createPool(configMysql)
		
		var bookidtemp = 0;		
		const checkindate = new Date().toLocaleString();

		const check = await pool.query(`
		INSERT INTO Books (roomid, paymentid, checkoutdate, checkindate, totalmoney, staffid)	
		VALUES (?, ?, ?, ?, ?, ?) `, 
		[roomid, paymentid, checkoutdate, checkindateText,  totalmoney, staffid]);
		
		await pool.query(`UPDATE Rooms SET status = ? 
		WHERE id = ? `,
		[statusRoom.DANGTHUE, roomid])

		bookidtemp = check[0].insertId;
		
		if(bookidtemp !== 0) {
			var valueBookdetail ="";	
			//phải có khách hàng			
			
			if(customerid && customerid.length >0) {	
				if(typeof(customerid) === 'object') {
					for(let index = 0 ; index <customerid.length ; index++){
						valueBookdetail += `(${index+1} ,${bookidtemp}, ${customerid[index]} )`
						if(index <customerid.length - 1){
							valueBookdetail += ",";
						}
					}
				} else if (typeof(customerid) === 'string') {

					valueBookdetail = `(1 , ${bookidtemp}, ${customerid}) `;
				}
				
				let queryBookDetail =`INSERT INTO Bookdetails(id, bookid, customerid)
				VALUES ${valueBookdetail} `;

				await pool.query(queryBookDetail);			
	
				var valueRoomServiceDetail ="";	
				if (roomserviceid && roomserviceid.length > 0) {
					if (typeof(roomserviceid) === 'object') {
						for(let index = 0 ; index <roomserviceid.length ; index++){
							valueRoomServiceDetail += 
							`(${index+1} ,${bookidtemp}, ${roomserviceid[index]}, ${quantityTemp[index]}  )`
							if(index <roomserviceid.length - 1){
								valueRoomServiceDetail += ",";
							}
						}
					} else if (typeof(roomserviceid) === 'string'){
						valueRoomServiceDetail = ` (1, ${bookidtemp} , ${roomserviceid} , ${quantityTemp}) `
					}
					
					let queryRoomServiceDetail =`INSERT INTO Roomservicedetails(id, bookid, roomserviceid, quantity)
					VALUES ${valueRoomServiceDetail} `;

					await pool.query(queryRoomServiceDetail);

				}
				await pool.end();
				response.json({
					message: "Success",
					success: true
				})
			}
		}
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}
const putBook = async (request, response) =>{

	try {	
		
		const {bookid, paymentid, customerid, roomserviceid, quantityTemp, checkoutdate, totalmoney} = request.body;
		

		if(!(customerid && customerid.length >0)) {
			response.json({
				message: "Error",
				success: false
			})
			return;
		}
		const pool = mysql.createPool(configMysql)
		
		if(bookid) {
			
			var deleteRoomService = ``;			
			let roomServiceDetailByBookid = await pool.query(queryRoomServiceDetailByBookid, [bookid]);
			roomServiceDetailByBookid = roomServiceDetailByBookid[0];

			for(let i=0; i< roomServiceDetailByBookid.length ; i++) {

				deleteRoomService = `DELETE FROM RoomServiceDetails WHERE bookid = 
				${roomServiceDetailByBookid[i].bookid} AND id = ${roomServiceDetailByBookid[i].id} 
				AND roomserviceid = ${roomServiceDetailByBookid[i].roomserviceid} ;
				`
				await pool.query(deleteRoomService);
			}

			let bookdetails = await pool.query(queryBookDetailByBookid, [bookid]);
			bookdetails = bookdetails[0];


			for(let i=0; i< bookdetails.length ; i++) {
				
				deleteRoomService = `DELETE FROM BookDetails WHERE bookid = 
				${bookdetails[i].bookid} AND id = ${bookdetails[i].id} 
				AND customerid = ${bookdetails[i].customerid} ;
				`
				await pool.query(deleteRoomService);
			}	
			
			await pool.query(`UPDATE Books SET  paymentid = ? , checkoutdate = ?, totalmoney = ?
			WHERE id = ?`,[  paymentid, checkoutdate, totalmoney, bookid]);

			var valueBookdetail ="";	
			
			if(customerid && customerid.length >0) {	
				if(typeof(customerid) === 'object') {
					for(let index = 0 ; index <customerid.length ; index++){
						valueBookdetail += `(${index+1} ,${bookid}, ${customerid[index]} )`
						if(index <customerid.length - 1){
							valueBookdetail += ",";
						}
					}
				} else if (typeof(customerid) === 'string') {

					valueBookdetail = `(1 , ${bookid}, ${customerid}) `;
				}
				
				let queryBookDetail =`INSERT INTO Bookdetails(id, bookid, customerid)
				VALUES ${valueBookdetail} `;

				await pool.query(queryBookDetail);			
	
				var valueRoomServiceDetail ="";	
				if (roomserviceid && roomserviceid.length > 0) {
					if (typeof(roomserviceid) === 'object') {
						for(let index = 0 ; index <roomserviceid.length ; index++){
							valueRoomServiceDetail += 
							`(${index+1} ,${bookid}, ${roomserviceid[index]}, ${quantityTemp[index]}  )`
							if(index <roomserviceid.length - 1){
								valueRoomServiceDetail += ",";
							}
						}
					} else if (typeof(roomserviceid) === 'string'){
						valueRoomServiceDetail = ` (1, ${bookid} , ${roomserviceid} , ${quantityTemp}) `
					}
					
					let queryRoomServiceDetail =`INSERT INTO Roomservicedetails(id, bookid, roomserviceid, quantity)
					VALUES ${valueRoomServiceDetail} `;
					
					await pool.query(queryRoomServiceDetail);

				}
				await pool.end();
				
				response.json({
					message: "Success",
					success: true
				})
			}
		} 
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const putBookSuccess = async (request, response) =>{

	try {
		const {bookid, roomid, staffid } = request.body;
		const queryBook = `UPDATE Books SET statusBook = ?,
		staffid = ?
		WHERE id = ?`;
		const queryRoom = `UPDATE Rooms SET status = ?
		WHERE id = ? `;
		
		const pool = mysql.createPool(configMysql)
		await pool.query(queryBook, [statusBook.DATHANHTOAN,staffid,  bookid]);
		await pool.query(queryRoom, [statusRoom.SANSANG, roomid]);
		await pool.end();
		response.json({
			message: "Success",
			success: true
		})
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const deleteBook = (request, response) =>{

}

const loadBookData = async (request, response) =>{
	
	try {


		const queryRoom = `SELECT main.*, roo.roomtypename, roo.price 
		FROM Rooms main 
		LEFT JOIN Roomtypes roo ON (main.roomtype = roo.id)
		WHERE roo.isDelete = ${isDelete.false} AND main.isDelete =${isDelete.false} `;
		const queryPayment = `SELECT * FROM Payments WHERE  isDelete = ${isDelete.false}`;

		const queryCustomer = `SELECT main.*, cus.customertypename 
		FROM Customers main 
		LEFT JOIN Customertypes cus ON (main.customertype = cus.id)
		WHERE main.isDelete = ${isDelete.false} AND cus.isDelete = ${isDelete.false}`;

		const queryRoomService = `SELECT * FROM RoomServices WHERE isDelete = ${isDelete.false}`;

		const pool = mysql.createPool(configMysql);

		const rooms = await pool.query(queryRoom);
		const payments = await pool.query(queryPayment);
		const customers = await pool.query(queryCustomer);
		const roomservices = await pool.query(queryRoomService);
		await pool.end();

		response.json({
			rooms: rooms[0],
			payments: payments[0],
			customers: customers[0],
			roomservices:roomservices[0],
			success: true
		})
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const loadBookDataByStaff = async (request, response) =>{
	
	try {

		

		const queryRoom = `SELECT main.*, roo.roomtypename, roo.price 
		FROM Rooms main 
		LEFT JOIN Roomtypes roo ON (main.roomtype = roo.id)
		
		AND roo.isDelete = ? 
		AND main.isDelete = ? 
		`;
		const queryPayment = `SELECT * FROM Payments WHERE  isDelete = ${isDelete.false}`;

		const queryCustomer = `SELECT main.*, cus.customertypename 
		FROM Customers main 
		LEFT JOIN Customertypes cus ON (main.customertype = cus.id)
		WHERE main.isDelete = ${isDelete.false} AND cus.isDelete = ${isDelete.false}`;

		const queryRoomService = `SELECT * FROM RoomServices WHERE isDelete = ${isDelete.false}`;

		const pool = mysql.createPool(configMysql);

		const rooms = await pool.query(queryRoom, [  isDelete.false, isDelete.false]);
		const payments = await pool.query(queryPayment);
		const customers = await pool.query(queryCustomer);
		const roomservices = await pool.query(queryRoomService);
		await pool.end();

		response.json({
			rooms: rooms[0],
			payments: payments[0],
			customers: customers[0],
			roomservices:roomservices[0],
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
    getBookById,getBookByIdAndStaff,
	postBook, putBook, 
	deleteBook,  
	loadBookData, loadBookDataByStaff,
	getBook, putBookSuccess, 
	getBookByIdFromTo, getBookByIdFromToByStaff,
	searchBook, searchBookByStaff,
	getAllBookByStaff,getAllBook


};

