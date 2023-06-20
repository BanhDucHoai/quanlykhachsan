
const { Router } = require('express');
const { getReportByStaff} = 
require('../Controllers/reportstaff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getReportByStaff);
    

module.exports = router;