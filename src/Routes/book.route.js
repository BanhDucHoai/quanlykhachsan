const { Router } = require('express');
const { getAllBook,searchBookByStaff, getBookByIdAndStaff, loadBookDataByStaff, getAllBookByStaff, searchBook, getBook, getBookByIdFromTo, loadBookData, getBookById, postBook, putBook, deleteBook, putBookSuccess } = require('../Controllers/book.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = Router();

    router.get('/', getBook);
    router.get('/all',validateToken, getAllBook);
    router.get('/staff/all',validateToken, getAllBookByStaff);
    router.get('/load',validateToken, loadBookData);
    router.get('/staff/load',validateToken, loadBookDataByStaff);
    router.get('/:id',validateToken, getBookById);
    router.get('/staff/:id',validateToken, getBookByIdAndStaff);
    router.get('/page/:id/:rowinpage',validateToken, getBookByIdFromTo);
    router.post('/',validateToken, postBook);
    router.post('/search',validateToken, searchBook);
    router.post('/searchstaff',validateToken, searchBookByStaff);
    router.put('/',validateToken, putBook);
    router.put('/success',validateToken, putBookSuccess);
    router.delete('/',validateToken, deleteBook)

module.exports = router;




