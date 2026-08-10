const express = require('express');

const router = express.Router();

const authenticate =
  require('../../../middlewares/auth.middleware');

const checkRole =
  require('../../../middlewares/role.middleware');

const paymentValidation =
  require('../payment.validation');

const paymentAdminController =
  require('./payment.admin.controller');

router.get(
  '/',
  authenticate,
  checkRole('ADMIN'),
  paymentAdminController.getPayments
);

router.get(
  '/:id',
  authenticate,
  checkRole('ADMIN'),
  paymentValidation.validatePaymentId,
  paymentAdminController.getPaymentDetail
);

module.exports = router;