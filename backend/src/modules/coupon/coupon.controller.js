const couponService = require('./coupon.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { MESSAGES } = require('./coupon.constants');

const couponController = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await couponService.getAllCoupons(req.query, userId);

      return sendSuccess(res, 200, MESSAGES.FETCH_SUCCESS, result);
    } catch (err) {
      console.error('Get customer coupons error:', err);
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
  }
};

module.exports = couponController;