const express = require('express');
const controller = require('../controllers/controller.js')

let router = express.Router();

router.get('/products', controller.home);

module.exports = router;