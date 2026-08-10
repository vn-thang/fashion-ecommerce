const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const orderValidation = require('./order.validation');

const authenticate = require('../../middlewares/auth.middleware'); 
router.use(authenticate);

router.post('/preview', orderValidation.validatePreview, orderController.previewCheckout);

router.post('/create', orderValidation.validateCreateOrder, orderController.createOrder);

router.get('/', orderController.getMyOrders);

router.get('/:id', orderValidation.validateOrderId, orderController.getOrderDetails);

router.patch(
  '/:id/cancel',
  orderValidation.validateCancelOrder,
  orderController.cancelOrder
);

module.exports = router;