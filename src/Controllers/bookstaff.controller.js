
const getBookByStaff = async (request, response) => {
		
	response.render('Bookstaff', {title : 'Books', layout: 'layoutstaff'})
}

module.exports = {
    getBookByStaff
};

