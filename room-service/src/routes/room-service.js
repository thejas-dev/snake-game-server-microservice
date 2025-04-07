const express = require('express');
const { createRoom, checkRoom, joinRoom, editPosition } = require('../controllers/room-controllers');
const router = express.Router();

router.post('/createRoom',createRoom);
router.post('/checkRoom',checkRoom);
router.post('/joinRoom/:id',joinRoom);
router.post('/editPosition',editPosition);

module.exports = router;