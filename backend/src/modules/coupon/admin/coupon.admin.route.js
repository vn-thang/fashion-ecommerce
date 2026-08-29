const express = require('express');
const router = express.Router();

const authenticate = require('../../../middlewares/auth.middleware');
const checkRole = require('../../../middlewares/role.middleware');
const couponValidation = require('../coupon.validation');
const couponAdminController = require('./coupon.admin.controller');

router.post(
  '/',
  authenticate,
  checkRole('ADMIN'),
  couponValidation.validateCreate,
  couponAdminController.create
);

router.get(
  '/',
  authenticate,
  checkRole('ADMIN'),
  couponAdminController.getAll
);

router.get(
  '/:id',
  authenticate,
  checkRole('ADMIN'),
  couponValidation.validateParamsId,
  couponAdminController.getOne
);

router.put(
  '/:id',
  authenticate,
  checkRole('ADMIN'),
  couponValidation.validateUpdate,
  couponAdminController.update
);

router.delete(
  '/:id',
  authenticate,
  checkRole('ADMIN'),
  couponValidation.validateParamsId,
  couponAdminController.deactivate
);

module.exports = router;