
const { Router } = require('express');
const { getProfile} = 
require('../Controllers/profile.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getProfile);   
    

module.exports = router;