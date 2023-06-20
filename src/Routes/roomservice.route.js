
const { Router } = require('express');
const { 
    getRoomService,
    getAllRoomService,
    getRoomServiceById,
    postRoomService,
    putRoomServiceById,
    deleteRoomServiceById,
    searchRoomService,
    getRoomServiceByIdFromTo
} = require('../Controllers/RoomService.controller');
const {validateToken} = require('../Helpers/validateToken.helper');
const {validateTokenRoleAdmin} = require('../Helpers/validateTokenRoleAdmin.helper')
const router = Router();

    router.get('/', getRoomService);
    router.get('/all',validateToken, getAllRoomService);
    router.get('/:id',validateToken, getRoomServiceById);   
    router.get('/page/:id/:rowinpage',validateToken, getRoomServiceByIdFromTo); 
    router.post('/search',validateTokenRoleAdmin, searchRoomService);
    router.post('/',validateTokenRoleAdmin, postRoomService);
    
    router.put('/',validateTokenRoleAdmin, putRoomServiceById);
    router.delete('/',validateTokenRoleAdmin, deleteRoomServiceById);

module.exports = router;