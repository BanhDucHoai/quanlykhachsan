const { Router } = require('express');
const { index } = require('../Controllers/index.controller');


const router = Router();

    router.get('/', index);

module.exports = router;
