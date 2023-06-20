const { Router } = require('express');
const { getAllBook, getBook,  getBookById} = require('../Controllers/booking.controller');
const {validateToken} = require('../Helpers/validateToken.helper');
const router = Router();

    router.get('/', getBook);
    router.get('/all',validateToken, getAllBook);
    

    router.get('/:id',validateToken, getBookById);
    

module.exports = router;




