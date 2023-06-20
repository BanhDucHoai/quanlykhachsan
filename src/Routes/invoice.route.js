
const { Router } = require('express');
const {    
    getAllInvoice
} = require('../Controllers/invoice.controller');

const router = Router();
    router.get('/:id',  getAllInvoice)

module.exports = router;