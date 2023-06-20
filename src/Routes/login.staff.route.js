const { Router } = require('express');
const { login,  getlogin, changepass } = require('../Controllers/loginstaff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();
    router.get('/login', getlogin)
    router.post('/login', login);
    router.put('/changepass', validateToken, changepass);

module.exports = router;
