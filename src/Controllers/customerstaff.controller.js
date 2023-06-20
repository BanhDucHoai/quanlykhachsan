
const getCustomerByStaff = async (request, res) => {

    res.render('customerstaff', {title : 'Customers', layout:'layoutstaff'});
}

module.exports = {    
	getCustomerByStaff
};

