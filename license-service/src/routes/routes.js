const express = require('express');
const { createLicense, getLicense } = require('../controllers/license-controllers');
const router = express.Router();

router.post('/createLicense', createLicense);
router.post('/getLicense', getLicense);

module.exports = router;