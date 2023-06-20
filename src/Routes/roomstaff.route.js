
const { Router } = require('express');
const { getRoomByStaff } = 
require('../Controllers/roomstaff.controller');

const router = Router();

    router.get('/', getRoomByStaff);

module.exports = router;