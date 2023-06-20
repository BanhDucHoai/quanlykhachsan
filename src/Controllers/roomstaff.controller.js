

const getRoomByStaff = async (request, response) => {
    
    response.render('Roomstaff', {title : 'Rooms', layout:'layoutstaff'});
}

module.exports = {
    getRoomByStaff
    
};

