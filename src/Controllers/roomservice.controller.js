const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const { isDelete, rowInPage } = require('../utils/const'); 
const {verifiedToken} = require('../Helpers/validateToken.helper')

const getRoomService = async (request, res) => {

    res.render('RoomService', {title : 'RoomServices', role:'admin'});
}

const postRoomService = async (request, response) => {
    try {

		const {roomservicename, price} = request.body;	
		var query = `
		INSERT INTO RoomServices 
		(roomservicename, price) 
		VALUES ('${roomservicename}', ${price}) `;
		const pool = mysql.createPool(configMysql);
		await pool.query(query);
		await pool.end();
		response.json({
			message : 'Thêm mới thành công',
			success: true
		});
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const putRoomServiceById = async (request, response) => {
    try {

		const {id, roomservicename, price} = request.body;	

		var query = `
		UPDATE RoomServices
		SET roomservicename = "${roomservicename}",
		price = "${price}"
		WHERE id = "${id}"
		`;
		const pool = mysql.createPool(configMysql);
		await pool.query(query);
		
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

const deleteRoomServiceById = async (request, response) => {
    try {
		const {id}= request.body;
		var query = `
		UPDATE RoomServices
		SET isDelete = ${isDelete.true}
		WHERE id = "${id}"
		`;
		const pool = mysql.createPool(configMysql);
		await pool.query(query);
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

const getRoomServiceById = async (request, response) => {
	try {
		const {id} = request.params;

		var query = `SELECT *
		FROM RoomServices 
		WHERE id = "${id}"`;
		const pool = mysql.createPool(configMysql);
		
		const roomService = await pool.query(query);
		response.json({
			data:roomService[0][0],
			success: true
		});

	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const searchRoomService = async (request, response) => {
	try {
		const {search} = request.body;

		var searchWith = '';
		if(search !== '') {
			searchWith = ` AND roomservicename LIKE '%${search}%'  `;
		}

		var query = `SELECT *
		FROM RoomServices 
		WHERE  isDelete = ? ` + searchWith;
		const pool = mysql.createPool(configMysql);
		
		const roomService = await pool.query(query, isDelete.false);
		response.json({
			data:roomService[0],
			success: true, 
			rowInPage: rowInPage
		});

	} catch (error) {

		response.json({
			message: error.message,
			success: false, 
			rowInPage: rowInPage
		})
	}
}

const getAllRoomService = async (request, response) => {
    
    try {

			var query = `SELECT id, roomservicename, price
			FROM RoomServices 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;
		
			const pool = mysql.createPool(configMysql);
			const roomServices = await pool.query(query);
			await pool.end();
			
			response.json({
				data: roomServices[0],
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

const getRoomServiceByIdFromTo = async (request, response) =>{

	try {
		const {id, rowinpage} = request.params;

			
			var query = `SELECT *
			FROM RoomServices 
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
    getRoomService,
    getAllRoomService,
    getRoomServiceById,
	postRoomService,
	putRoomServiceById,
	deleteRoomServiceById,
	searchRoomService,
	getRoomServiceByIdFromTo
};