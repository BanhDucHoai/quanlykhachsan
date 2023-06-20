
const getReportByStaff = async (request, response) => {
		
	response.render('Reportstaff', {title : 'Reports', layout:'layoutstaff'});
}

module.exports = {
   
	getReportByStaff
};

