const { Router } = require('express');
const {  getBookByStaff } = require('../Controllers/bookstaff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getBookByStaff);
    

module.exports = router;




