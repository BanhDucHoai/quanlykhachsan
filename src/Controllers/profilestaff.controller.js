

const getProfile = async (request, response) => {
    
    response.render('Profilestaff', {title : 'Profile', layout:'layoutstaff'});
}

module.exports = {
    getProfile
};