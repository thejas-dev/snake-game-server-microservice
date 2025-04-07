const express = require('express');
const {getUserDetails, addRoomToUser} = require('../controllers/user-controllers')

const router = express.Router();

router.post('/getUserDetails',getUserDetails);
router.post('/addRoomToUser',addRoomToUser);

module.exports = router;