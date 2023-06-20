
const { Router } = require('express');
const { 
    getRoomType,
    getAllRoomType, 
    getRoomTypeById,
	postRoomType,
	putRoomTypeById,
	deleteRoomTypeById,
    searchRoomType,
    getRoomTypeByIdFromTo
} = require('../Controllers/roomtype.controller');

const {validateTokenRoleAdmin} = require('../Helpers/validateTokenRoleAdmin.helper')

const {validateToken} = require('../Helpers/validateToken.helper')
const router = Router();

    router.get('/',getRoomType);
    router.get('/all', validateToken, getAllRoomType);
    router.get('/:id',validateToken, getRoomTypeById);
    router.get('/page/:id/:rowinpage',validateTokenRoleAdmin, getRoomTypeByIdFromTo);
    router.post('/',validateTokenRoleAdmin, postRoomType);
    router.post('/search',validateTokenRoleAdmin, searchRoomType);
    router.put('/',validateTokenRoleAdmin, putRoomTypeById);
    router.delete('/',validateTokenRoleAdmin, deleteRoomTypeById);

module.exports = router;