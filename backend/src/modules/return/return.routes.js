const express = require('express');

const router = express.Router();

const returnController = require('./return.controller');
const returnValidation = require('./return.validation');

const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post(
  '/',
  returnValidation.validateCreate,
  returnController.create
);

router.get(
  '/',
  returnController.getAll
);

router.get(
  '/order/:orderId',
  returnValidation.validateId,
  returnController.getByOrderId
);

router.get(
  '/:id',
  returnValidation.validateId,
  returnController.getById
);

router.patch(
  '/:id/cancel',
  returnValidation.validateId,
  returnController.cancel
);

router.patch(
  '/:id/shipping',
  returnValidation.validateId,
  returnController.markShipping
);

module.exports = router;