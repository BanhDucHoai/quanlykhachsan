
const { Router } = require('express');
const { getStaff, getAllStaff, getStaffByIdFromTo, getStaffById, postStaff, putStaffById, deleteStaffById, searchStaff} = 
require('../Controllers/staff.controller');
const {validateToken} = require('../Helpers/validateToken.helper');
const {validateTokenRoleAdmin} = require('../Helpers/validateTokenRoleAdmin.helper')

const router = Router();
    router.get('/', getStaff);
    router.get('/all',validateTokenRoleAdmin, getAllStaff);
    router.get('/:id',validateTokenRoleAdmin, getStaffById);
    router.get('/page/:id/:rowinpage',validateTokenRoleAdmin, getStaffByIdFromTo);
    
    router.post('/search',validateTokenRoleAdmin, searchStaff);
    router.post('/',validateTokenRoleAdmin, postStaff);
    router.put('/',validateTokenRoleAdmin, putStaffById);
    router.delete('/',validateTokenRoleAdmin, deleteStaffById);
    

module.exports = router;