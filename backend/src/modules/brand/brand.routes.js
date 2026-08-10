const express = require('express');
const router = express.Router();
const brandController = require('./brand.controller');

router.get('/', brandController.getAllActive);

module.exports = router;