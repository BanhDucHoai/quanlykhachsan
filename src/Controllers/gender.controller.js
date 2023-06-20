const { isDelete, rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const {verifiedToken} = require('../Helpers/validateToken.helper')

const getGender = async (request, res) => {

    res.render('Gender', {title : 'Genders',role:'admin'});
}

const getGenderByIdFromTo = async (request, response) =>{
	
	try {
		const {id, rowinpage} = request.params;
			
			var query = `SELECT *
			FROM Genders 
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


const getGenderById = async (request, response) => {
    
    try {
		var {id} = request.params;
		
		var query = `SELECT *
		FROM Genders 
		WHERE id = "${id}"`;
		const pool = mysql.createPool(configMysql);
		const gender = await pool.query(query);
		response.json({
			data: gender[0][0], 
			success: true
		});
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const searchGender = async (request, response) => {

    try {
		const {search} = request.body;
		var searchWith = '';
		if(search !== '') {
			searchWith = ` AND gendername LIKE '%${search}%'  `;
		}

		var query = `SELECT *
		FROM Genders 
		WHERE  isDelete = ?
		` + searchWith;
		const pool = mysql.createPool(configMysql);
		const gender = await pool.query(query, [isDelete.false]);
		await pool.end();
		response.json({
			data: gender[0], 
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

const postGender = async (request, response) => {
    
    try {
		
        const {gendername} = request.body;	
		var query = `
		INSERT INTO Genders 
		(gendername) 
		VALUES ('${gendername}') `;
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
const putGenderById = async (request, response) => {
    
    try {
		
		const {id, gendername} = request.body;	

		var query = `
		UPDATE Genders
		SET gendername = "${gendername}"
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
const deleteGenderById = async (request, response) => {
    
    try {
		var id = request.body.id;

        var query = `
		UPDATE Genders
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

const getAllGender = async (request, response) => {    
	
    try {

		
		
		var query = `SELECT id, gendername
		FROM Genders 
		WHERE isDelete = ${isDelete.false} 
		ORDER BY id ASC`;  
		const pool = mysql.createPool(configMysql);
		const genders = await pool.query(query);
		await pool.end();
		response.json({
			data: genders[0],
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
module.exports = {
    getGender,
    getAllGender,
    getGenderById,
	postGender,
	putGenderById,
	deleteGenderById,
	searchGender,
	getGenderByIdFromTo
};