
const { isDelete, rowInPage } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const {verifiedToken} = require('../Helpers/validateToken.helper')

const getCustomerType = async (request, res) => {

    res.render('CustomerType', {title : 'CustomerTypes', role:'admin'});
}

const getCustomerTypeById = async (request, response) => {

    try {
		var {id} = request.params;

		var query = `SELECT *
		FROM CustomerTypes main
		WHERE main.id = "${id}"`;
		const pool = mysql.createPool(configMysql);
		const customertype = await pool.query(query);
		await pool.end();
		response.json({
			data: customertype[0][0],
			success: true
		});
		
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const searchCustomerType = async (request, response) => {

    try {
		const {search} = request.body;
		var searchWith = '';
		if(search !== '') {
			searchWith = ` AND main.customertypename LIKE '%${search}%'  `;
		}
		var query = `SELECT *
		FROM CustomerTypes main
		WHERE  main.isDelete = ?
		` + searchWith;
		const pool = mysql.createPool(configMysql);
		const customertype = await pool.query(query, [isDelete.false]);
		await pool.end();
		response.json({
			data: customertype[0],
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

const getCustomerTypeByIdFromTo = async (request, response) =>{

	try {
		const {id, rowinpage} = request.params;

			
			var query = `SELECT *
			FROM CustomerTypes 
			WHERE isDelete = ${isDelete.false}  
			ORDER BY main.id ASC
			LIMIT ? , ?`;
			
			const pool = mysql.createPool(configMysql);
			const data = await pool.query(query, [parseInt(id), parseInt(rowinpage)]);
			
			await pool.end();			
			response.json({
				data: data[0],
			});
			
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const postCustomerType = async (request, response) => {

    try {
		const {customertypename} = request.body;	
		var query = `
		INSERT INTO CustomerTypes 
		(customertypename) 
		VALUES ('${customertypename}') `;
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
const putCustomerTypeById = async (request, response) => {

    try {

		const {id, customertypename} = request.body;	
		var query = `
		UPDATE CustomerTypes
		SET customertypename = "${customertypename}"
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
const deleteCustomerTypeById = async (request, response) => {

    try {
		var id = request.body.id;

        var query = `
		UPDATE CustomerTypes
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

const getAllCustomerType = async (request, response) => {

    try {

		var query = `SELECT id, customertypename
			FROM CustomerTypes 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;  

		const pool = mysql.createPool(configMysql);
		const customertypes = await pool.query(query);
		await pool.end();
		response.json({
			data: customertypes[0],
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
    getCustomerType,
    getAllCustomerType,
    getCustomerTypeById,
	postCustomerType,
	putCustomerTypeById,
	deleteCustomerTypeById,
	searchCustomerType,
	getCustomerTypeByIdFromTo
};