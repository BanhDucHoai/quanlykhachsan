const { Router } = require('express');
const {  getBookingByStaff} = require('../Controllers/bookingstaff.controller');

const router = Router();

    router.get('/', getBookingByStaff);    

module.exports = router;




