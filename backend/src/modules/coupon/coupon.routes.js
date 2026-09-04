const express = require('express');
const router = express.Router();

const authenticate = require('../../middlewares/auth.middleware');
const couponController = require('./coupon.controller');
const couponValidation = require('./coupon.validation');

router.get(
  '/client',
  authenticate,
  couponController.getAllClient);

router.get(
  '/:id',
  authenticate,
  couponValidation.validateParamsId,
  couponController.getOne
);

module.exports = router;