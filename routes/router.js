const express = require('express');
const controller = require('../controllers/controller.js')

let router = express.Router();

router.get('/products', controller.home);
router.get('/cart_items', controller.getCart);
router.post('/cart_items', controller.postCart)
router.delete('/cart_items/:cart_id', controller.deleteFromCart);
router.post('/post', controller.postPaypal);
router.get('/success', controller.success);
router.get('/cancel', controller.cancel)

module.exports = router;