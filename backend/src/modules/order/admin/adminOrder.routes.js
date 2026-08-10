const express = require('express');

const router = express.Router();

const authenticate =
  require('../../../middlewares/auth.middleware');

const checkRole =
  require('../../../middlewares/role.middleware');

const orderValidation =
  require('../order.validation');

const adminOrderController =
  require('./adminOrder.controller');

router.get(
  '/',
  authenticate,
  checkRole('ADMIN'),
  adminOrderController.getAllOrdersForAdmin
);

router.get(
  '/:id',
  authenticate,
  checkRole('ADMIN'),
  orderValidation.validateOrderId,
  adminOrderController.getOrderDetailForAdmin
);

router.patch(
  '/:id/status',
  authenticate,
  checkRole('ADMIN'),
  orderValidation.validateOrderId,
  adminOrderController.updateOrderStatus
);

router.patch(
  '/:id/cancel',
  authenticate,
  checkRole('ADMIN'),
  orderValidation.validateOrderId,
  adminOrderController.cancelOrder
);

module.exports = router;