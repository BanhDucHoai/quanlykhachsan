
const { isDelete , rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');


const getRoomType = async (request, response) => {
    
    response.render('RoomType', {title : 'RoomTypes', layout: 'layout' });
}


const getAllRoomType = async (request, response) => {
    
    try {		
		var query = `SELECT *
		FROM RoomTypes 
		WHERE isDelete = ${isDelete.false}  
		ORDER BY id ASC`;  
		const pool = mysql.createPool(configMysql);
		roomtypes = await pool.query(query);
		pool.end();
		if(roomtypes[0].length > 0){

			response.json({
				data: roomtypes[0],
				success: true, 
				rowInPage: rowInPage
			})
		}
    } catch (error) {

		response.json({
			message: "Error", 
			success :false
		})
    }	
}

const getRoomTypeById = async (request, response) =>{
	try {
		var {id} = request.params;

		var query = `SELECT *
		FROM RoomTypes 
		WHERE id = "${id}" AND isDelete = ${isDelete.false} `;
		const pool = mysql.createPool(configMysql);
		const roomtype = await pool.query(query);
		pool.end();
		response.json({
			data:roomtype[0][0],
			success: true
		})
	} catch (error) {

		response.json({
			message:  "error",
			success: false
		})
	}
}

const searchRoomType = async (request, response) =>{
	try {
		const {search} = request.body
		var searchWith = '';
		if(search !== '') {
			searchWith = `AND roomtypename LIKE '%${search}%' `;
		}

		var query = `SELECT *
		FROM RoomTypes 
		WHERE  isDelete = ? ` + searchWith;
		const pool = mysql.createPool(configMysql);
		const roomtype = await pool.query(query, [isDelete.false]);
		pool.end();
		response.json({
			data:roomtype[0],
			success: true, 
			rowInPage: rowInPage
		})
	} catch (error) {

		response.json({
			message:  "error",
			success: false
		})
	}
}

const postRoomType = async (request, response) =>{
	try {

		
        const {roomtypename, price, maxcustomer} = request.body;	
		var query = `
		INSERT INTO RoomTypes 
		(roomtypename, price ,maxcustomer) 
		VALUES (?, ?, ?) `;
		const pool = mysql.createPool(configMysql);
		const isExistRoomName = await pool.query(`SELECT * FROM RoomTypes WHERE roomtypename LIKE '%${roomtypename}%' `);
		if(isExistRoomName[0][0]) {
			pool.end();
			response.json({
				message : "Roomtypename is Exits",
				success: false
			});
			return;
		}
		await pool.query(query,[roomtypename, price, maxcustomer]);
		pool.end();
		response.json({
			message : 'Thêm mới thành công',
			success: true
		});
		
	} catch (error) {

		response.json({
			message:  error,
			success: false
		})
	}
}

const putRoomTypeById = async(request, response) =>{
	try {
		const {id, roomtypename, price, maxcustomer} = request.body;	

		var query = `
		UPDATE RoomTypes
		SET roomtypename = ?,
		price = ?,
		maxcustomer = ?
		WHERE id = ?
		`;
		const pool = mysql.createPool(configMysql);
		await pool.query(query,[roomtypename, price, maxcustomer, id]);
		await pool.end();
		response.json({
			message : 'Sửa thành công',
			success: true
		});
		
	} catch (error) {
	
		response.json({
			message: error.message,
			success: false
		})
	}
}

const deleteRoomTypeById = async(request, response) =>{
	try {

		const {id} = request.body;
        var query = `
		UPDATE RoomTypes
		SET isDelete = ${isDelete.true}
		WHERE id = "${id}"
		`;
		const pool = mysql.createPool(configMysql);
		await pool.query(query);
		await pool.end();
		response.json({
			message : 'Xóa thành công',
			success: true
		});
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const getRoomTypeByIdFromTo = async (request, response) =>{

	try {
		const {id, rowinpage} = request.params;

			
			var query = `SELECT *
			FROM RoomTypes 
			WHERE isDelete = ${isDelete.false}  
			ORDER BY main.id ASC
			LIMIT ? , ?`;
			
			const pool = mysql.createPool(configMysql);
			const data = await pool.query(query, [parseInt(id), parseInt(rowinpage)]);
			
			await pool.end();			
			response.json({
				data: data[0],
				success: true
			});
			
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

module.exports = {
    getRoomType,
    getAllRoomType,
    getRoomTypeById,
	postRoomType,
	putRoomTypeById,
	deleteRoomTypeById,
	searchRoomType,
	getRoomTypeByIdFromTo
};