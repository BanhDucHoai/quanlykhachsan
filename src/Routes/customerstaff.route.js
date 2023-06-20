const express = require('express');
const { 
    getCustomerByStaff,
    
} = require('../Controllers/customerstaff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = express.Router();    
    router.get('/', getCustomerByStaff);    

module.exports = router;