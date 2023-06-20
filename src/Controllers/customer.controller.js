
const { isDelete, rowInPage } = require('../utils/const'); 
const {formatDate} = require('../utils/date');
const configMysql = require('../config/mysql.config')
const mysql = require('mysql2/promise');
const {verifiedToken} = require('../Helpers/validateToken.helper')

const getCustomer = async (request, res) => {

    res.render('customer', {title : 'Customers', layout:'layout'});
}

const getCustomerById = async (request, response) => {

    try {		
		const {id} = request.params;
		var query = `SELECT main.id, main.fullname, main.citizenIdentityCard,
		main.address, main.dateofbirth, main.gender, main.customertype, cus.customertypename
		FROM Customers main LEFT JOIN customertypes cus on (main.customertype = cus.id)
		WHERE main.id = "${id}"`;

		const pool = mysql.createPool(configMysql);
		const customer = await pool.query(query);
		await pool.end();

		response.json({
			data: customer[0][0],
			success: true
		});

	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const searchCustomer = async (request, response) => {

    try {
		const {search} = request.body;
		var searchWith = '';
		if(search !== '') {
			searchWith = ` AND main.fullname LIKE '%${search}%'  `;
		}

		var query = `SELECT main.id, main.fullname, main.citizenIdentityCard,
		main.address,  main.dateofbirth, main.gender, 
		main.customertype, cus.customertypename, gen.gendername
		FROM Customers main 
		LEFT JOIN customertypes cus on (main.customertype = cus.id)
		LEFT JOIN genders gen on (main.gender = gen.id)
		WHERE  main.isDelete = ?
		`;

		const pool = mysql.createPool(configMysql);
		var customer = await pool.query(query + searchWith, [isDelete.false]);
		if(customer[0].length === 0){
			if(search !== '') {
				searchWith = ` AND main.citizenIdentityCard LIKE '%${search}%'  `;
			}
			customer = await pool.query(query + searchWith, [isDelete.false])
		}
		await pool.end();

		response.json({
			data: customer[0],
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

const postCustomer = async (request, response) => {

    try {
        const {fullname,  address, citizenIdentityCard, customertype, dateofbirth, gender} = request.body;	        
		
		const queryCustomer = `SELECT * FROM Customers WHERE citizenIdentityCard = ? AND isDelete = ? `;
		var query = `
		INSERT INTO Customers 
		(fullname,  address, citizenIdentityCard, customertype, dateofbirth, gender) 
		VALUES (?, ? , ? ,? , ? , ?) `;
		const pool = mysql.createPool(configMysql);
		const isCustomer = await pool.query(queryCustomer,[citizenIdentityCard, isDelete.false]);
		if(isCustomer[0] && isCustomer[0].length > 0) {
			await pool.end()
			response.json({
				message : 'Căn cước công dân đã tồn tại',
				success: false
			});
			return;
		}
		await pool.query(query, [fullname,  address, citizenIdentityCard, customertype, dateofbirth, gender]);
		await pool.end();
		response.json({
			message : 'Tạo mới thành công',
			success: true
		});

	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const putCustomerById = async (request, response) => {

    try {
		const {id, fullname, address, citizenIdentityCard, customertype, dateofbirth, gender} = request.body;	

		const query = `
		UPDATE Customers 
		SET fullname = ?, 
		address = ?, 
		citizenIdentityCard = ? ,
        customertype = ?, 
		dateofbirth = ?, 
		gender = ? 
		WHERE id = ?
		`;
		const queryCustomer = `SELECT * FROM Customers WHERE citizenIdentityCard = ? `
		const pool = mysql.createPool(configMysql);
		const isCustomer = await pool.query(queryCustomer, [citizenIdentityCard])
		if (isCustomer[0] && isCustomer[0].length > 0 && parseInt(isCustomer[0][0].id) !== parseInt(id)) {
			await pool.end()
			response.json({
				message : 'Căn cước công dân đã tồn tại',
				success: false
			});
			return;
		}
		await pool.query(query, [fullname, address, citizenIdentityCard, customertype, dateofbirth, gender, id]);
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

const deleteCustomerById = async (request, response) => {

    try {
		const {id} = request.body

        const query = `
		UPDATE Customers 
		SET isDelete = ?
		WHERE id = ?
		`;
		const pool = mysql.createPool(configMysql);
		await pool.query(query, [isDelete.true, id]);
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

const getCustomerByIdFromTo = async (request, response) =>{

	try {
		const {id, rowinpage} = request.params;

			
			var queryCustomer = `SELECT main.id, main.fullname, main.citizenIdentityCard,
			main.address,  main.dateofbirth, gen.gendername , cus.customertypename
			FROM Customers main LEFT JOIN CustomerTypes cus on (main.customertype = cus.id)
			LEFT JOIN Genders gen on (main.gender = gen.id)
			WHERE main.isDelete = ${isDelete.false}  ORDER BY main.id ASC
			LIMIT ? , ?`;
			var queryCustomerType =  `SELECT * FROM CustomerTypes 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;
			var queryGender = `SELECT * FROM Genders 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;
			const pool = mysql.createPool(configMysql);
			const customers = await pool.query(queryCustomer, [parseInt(id), parseInt(rowinpage)]);
			const customertypes = await pool.query(queryCustomerType);
			const genders = await pool.query(queryGender);

			await pool.end();			
			response.json({
				customers: customers[0],
				customerType: customertypes[0],
				genderType: genders[0],
				success: true
			});
			
		
	} catch (error) {

		response.json({
			message: error.message,
			success: false
		})
	}
}

const getAllCustomer = async (request, response) => {
	
    try {

			var queryCustomer = `SELECT main.id, main.fullname as fullname, main.citizenIdentityCard,
			main.address,  main.dateofbirth, gen.gendername , cus.customertypename
			FROM Customers main LEFT JOIN CustomerTypes cus on (main.customertype = cus.id)
			LEFT JOIN Genders gen on (main.gender = gen.id)
			WHERE main.isDelete = ${isDelete.false}  ORDER BY main.id ASC`; 
			var queryCustomerType =  `SELECT * FROM CustomerTypes 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;
			var queryGender = `SELECT * FROM Genders 
			WHERE isDelete = ${isDelete.false}  ORDER BY id ASC`;
			const pool = mysql.createPool(configMysql);
			const customers = await pool.query(queryCustomer);
			const customertypes = await pool.query(queryCustomerType);
			const genders = await pool.query(queryGender);

			response.json({
				data: customers[0],
				customerType: customertypes[0],
				genderType: genders[0],
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
    getCustomer,
    getAllCustomer,
    getCustomerById,
	postCustomer,
	putCustomerById,
	deleteCustomerById,
	getCustomerByIdFromTo,
	searchCustomer
};

