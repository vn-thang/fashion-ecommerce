const couponService = require('./coupon.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { MESSAGES } = require('./coupon.constants');

const couponAdminController = {
  create: async (req, res) => {
    try {
      const result = await couponService.createCoupon(req.body);
      return sendSuccess(res, 201, MESSAGES.CREATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await couponService.getAllCoupons(req.query);
      return sendSuccess(res, 200, MESSAGES.FETCH_SUCCESS, result);
    } catch (err) {
      console.error('Get admin coupons error:', err);
      return sendError(res, 500, err.message);
    }
  },

  getOne: async (req, res) => {
    try {
      const result = await couponService.getCouponById(req.params.id);
      return sendSuccess(res, 200, MESSAGES.FETCH_SUCCESS, result);
    } catch (err) {
      return sendError(res, 404, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await couponService.updateCoupon(
        req.params.id,
        req.body
      );

      return sendSuccess(res, 200, MESSAGES.UPDATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

deactivate: async (req, res) => {
  try {
    await couponService.deactivateCoupon(req.params.id);

    return sendSuccess(
      res,
      200,
      MESSAGES.DELETE_SUCCESS
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
}
};

module.exports = couponAdminController;