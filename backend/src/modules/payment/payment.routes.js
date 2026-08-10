const express = require('express');

const router = express.Router();

const authenticate =
  require('../../middlewares/auth.middleware');

const paymentController =
  require('./payment.controller');

const paymentValidation =
  require('./payment.validation');

router.post(
  '/vnpay/create',
  authenticate,
  paymentValidation.validateCreatePayment,
  paymentController.createPaymentUrl
);
router.get(
  '/vnpay/verify',
  paymentValidation.validateReturn,
  paymentController.handleReturn
);

router.get(
  '/vnpay/ipn',
  paymentValidation.validateIpn,
  paymentController.handleIpn
);
module.exports = router;