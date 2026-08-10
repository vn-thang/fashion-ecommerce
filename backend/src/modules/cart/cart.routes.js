const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const cartValidation = require('./cart.validation');
const authenticate = require('../../middlewares/auth.middleware'); 
const authorize = require('../../middlewares/role.middleware'); 

router.use(authenticate); 

router.get('/', cartController.getCart);

router.post('/add', cartValidation.validateAddToCart, cartController.addToCart);

router.put('/item/:itemId', cartValidation.validateUpdateItem, cartController.updateQuantity);

router.delete('/item/:itemId', cartValidation.validateDeleteItem, cartController.removeItem);

router.delete('/clear', cartController.clearCart);

module.exports = router;