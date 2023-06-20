
const { isDelete } = require('../utils/const'); 
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../Helpers/generateTokens.helper');
const {verifiedToken, verifiedTokenByStaff} = require('../Helpers/validateToken.helper')


const getlogin = async (request, response) => {
    response.render('loginstaff');
}


const login = async (request, response) =>{
	try {
        const {username, password} = request.body;	
		
		const pool = mysql.createPool(configMysql);
		const isExistUserName = await pool.query(`SELECT * 
		FROM Staffs  		
		WHERE username = ? 
		AND isDelete = ?
		LIMIT 1`,[username, isDelete.false]);
		
		if(!isExistUserName[0][0]) {
			await pool.end();
			response.json({
				message : "username is Exits",
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
		const token = await  generateTokens(isExistUserName[0][0].id, isExistUserName[0][0].username, isExistUserName[0][0].password
		);

		response.json({
			message : 'Login success',
			accessToken: token,
			success: true,
			id: isExistUserName[0][0].id,
			username: isExistUserName[0][0].username
		});
		
	} catch (error) {

		response.json({
			message:  error,
			success: false
		})
	}
}
const changepass = async (request, response) => {
	try {
		const {oldpassword, newpassword } = request.body;
		const pool = mysql.createPool(configMysql);
		const username = verifiedTokenByStaff(request).username

		const isExistUserName = await pool.query(`
		SELECT * 
		FROM Staffs  		
		WHERE username = ? 
		AND isDelete = ?
		LIMIT 1`,[username, isDelete.false]);
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
		UPDATE Staffs
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
    getlogin,
	changepass
};