const { Router } = require('express');
const { login, registerStaff, getlogin, changepassword } = require('../Controllers/login.controller');


const router = Router();
    router.get('/login',getlogin)
    router.post('/login', login);
    router.post('/register', registerStaff);
    router.put('/changepass', changepassword);
module.exports = router;
