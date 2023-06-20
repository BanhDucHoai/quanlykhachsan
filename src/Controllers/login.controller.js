
const { isDelete } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../Helpers/generateTokens.helper');
const {verifiedToken, verifiedTokenByStaff} = require('../Helpers/validateToken.helper')
const getlogin = async (request, response) => {
    response.render('login');
}


const login = async (request, response) =>{
	try {
        const {username, password} = request.body;	
		
		const pool = mysql.createPool(configMysql);
		const isExistUserName = await pool.query(`SELECT main.*		
		FROM admin main 		
		WHERE username = ? 
		AND isDelete = ?
		LIMIT 1`,[username, isDelete.false]);
		
		if(!isExistUserName[0][0]) {
			await pool.end();
			response.json({
				message : "Username is Exits",
				success: false
			});
			return;
		}
		const validatedPassword =  bcrypt.compareSync( password, isExistUserName[0][0].password );
		
		if(!validatedPassword) {
			await pool.end();
			response.json({
				message : "Password wrong",
				success: false
			});
			return;
		}
		const token = await  generateTokens(isExistUserName[0][0].username.id, isExistUserName[0][0].username, isExistUserName[0][0].password); 

		response.json({
			message : 'Login success',
			accessToken: token,
			success: true,			
			username: username,
			id: isExistUserName[0][0].id
		});
		
	} catch (error) {

		response.json({
			message:  error,
			success: false
		})
	}
}
const registerStaff = async(request, response) =>{
	try {
		const { username, password} = request.body;	
		const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( password, salt );
		
		var query = `
		INSERT INTO admin (username, password)
		VALUE (?, ? ) `;
		const pool = mysql.createPool(configMysql);
		await pool.query(query,[username, pass]);
		await pool.end();
		response.json({
			message : 'Success',
			success: true
		});
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}
const changepassword = async (request, response) => {
	try {
		const {oldpassword, newpassword } = request.body;
		const pool = mysql.createPool(configMysql);
		const username = verifiedTokenByStaff(request).username

		const isExistUserName = await pool.query(`SELECT * 
		FROM admin  		
		WHERE username = ? LIMIT 1`,[username]);
		const validatedPassword =  bcrypt.compareSync( oldpassword, isExistUserName[0][0].password );

		if(!validatedPassword) {
			await pool.end();
			response.json({
				message : "Password wrong",
				success: false
			});
			return;
		}
		const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( newpassword, salt );
		
		var query = `
		UPDATE admin
		SET password = ?		
		WHERE  id = ? `;
		
		await pool.query(query,[pass, isExistUserName[0][0].id]);
		await pool.end();
		response.json({
			message : 'Success',
			success: true
		});		
		
	} catch (error) {
		response.json({
			success: false,
			message: error
		})
	}
}


module.exports = {
    login,
    registerStaff,
    getlogin,
	changepassword
};