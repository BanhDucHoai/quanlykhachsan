
const { Router } = require('express');
const { 
    getCustomerType,
    getAllCustomerType,
    getCustomerTypeById,
    postCustomerType,
    putCustomerTypeById,
    deleteCustomerTypeById,
    searchCustomerType,
    getCustomerTypeByIdFromTo
} = require('../Controllers/customertype.controller');
const {validateToken} = require('../Helpers/validateToken.helper');
const {validateTokenRoleAdmin} = require('../Helpers/validateTokenRoleAdmin.helper')
const router = Router();

    router.get('/', getCustomerType);
    router.get('/all', validateToken,getAllCustomerType);
    router.get('/:id', validateToken,getCustomerTypeById);
    router.get('/page/:id/:rowinpage', validateToken,getCustomerTypeByIdFromTo);
    router.post('/',validateTokenRoleAdmin, postCustomerType);
    router.post('/search',validateToken, searchCustomerType);
    router.put('/',validateTokenRoleAdmin, putCustomerTypeById);
    router.delete('/',validateTokenRoleAdmin, deleteCustomerTypeById);
    
module.exports = router;