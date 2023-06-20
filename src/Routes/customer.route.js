const express = require('express');
const { 
    getCustomer,
    getAllCustomer,
    getCustomerById,
    postCustomer,
    putCustomerById,
    deleteCustomerById,
    getCustomerByIdFromTo,
    searchCustomer
} = require('../Controllers/customer.controller');
const {validateToken} = require('../Helpers/validateToken.helper');

const router = express.Router();

    
    router.get('/', getCustomer);
    router.get('/all',validateToken, getAllCustomer);
    router.get('/:id',validateToken, getCustomerById);
    router.get('/page/:id/:rowinpage',validateToken, getCustomerByIdFromTo);
    router.post('/',validateToken, postCustomer);
    router.post('/search',validateToken, searchCustomer);
    router.put('/',validateToken, putCustomerById);
    router.delete('/',validateToken, deleteCustomerById);

module.exports = router;