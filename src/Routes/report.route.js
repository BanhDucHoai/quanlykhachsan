
const { Router } = require('express');
const { getReport, searchReport, searchReportByStaff, getBookByIdFromToStaff, getBookByIdFromTo} = 
require('../Controllers/report.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getReport);
    router.get('/admin/:checkdatefrom/:checkdateto',validateToken, searchReport);
    router.get('/page/:id/:rowinpage',validateToken, getBookByIdFromTo);
    router.get('/staff/:checkdatefrom/:checkdateto',validateToken, searchReportByStaff);
    router.get('/staff/page/:id/:rowinpage',validateToken, getBookByIdFromToStaff);

module.exports = router;