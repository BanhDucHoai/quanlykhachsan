
const { Router } = require('express');
const {    
    getAllInvoice
} = require('../Controllers/invoicestaff.controller');

const router = Router();
    router.get('/:id',  getAllInvoice)

module.exports = router;