
const { Router } = require('express');
const { getProfile} = 
require('../Controllers/profilestaff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getProfile);   
    

module.exports = router;