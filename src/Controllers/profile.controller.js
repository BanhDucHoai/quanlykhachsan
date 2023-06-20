

const getProfile = async (request, response) => {
    
    response.render('profile', {title : 'Profile', role:'admin'});
}

module.exports = {
    getProfile
};