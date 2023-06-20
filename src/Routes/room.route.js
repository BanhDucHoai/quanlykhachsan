
const { Router } = require('express');
const { getRoom, deleteRoomByStaff, postRoomByStaff, putRoomByStaff ,getRoomByIdStaff, getAllRoomByStaff,getRoomByIdFromToByStaff,searchRoomByStaff,  getAllRoom, getRoomByIdFromTo, getRoomById, postRoom, putRoomById, deleteRoomById, searchRoom} = 
require('../Controllers/room.controller');
const {validateToken} = require('../Helpers/validateToken.helper');
const {validateTokenRoleAdmin} = require('../Helpers/validateTokenRoleAdmin.helper')

const router = Router();

    router.get('/', getRoom);
    router.get('/all',validateToken, getAllRoom);
    router.get('/allbystaff',validateToken, getAllRoomByStaff);
    router.get('/:id',validateToken, getRoomById);
    router.get('/staff/:id',validateToken, getRoomByIdStaff);
    router.get('/pagebystaff/:id/:rowinpage',validateToken, getRoomByIdFromToByStaff);
    router.get('/page/:id/:rowinpage',validateToken, getRoomByIdFromTo);
    router.post('/search',validateToken, searchRoom);
    router.post('/searchbystaff',validateToken, searchRoomByStaff);
    router.post('/',validateTokenRoleAdmin, postRoom);
    router.put('/',validateTokenRoleAdmin, putRoomById);
    router.post('/staff',validateToken, postRoomByStaff);
    router.put('/staff',validateToken, putRoomByStaff);
    router.delete('/',validateTokenRoleAdmin, deleteRoomById);
    router.delete('/staff',validateTokenRoleAdmin, deleteRoomByStaff);

module.exports = router;