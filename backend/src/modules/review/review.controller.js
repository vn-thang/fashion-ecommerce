const reviewService = require('./review.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { REVIEW_MESSAGES } = require('./review.constants');

const reviewController = {
  createReview: async (req, res) => {
    try {
      const userId = req.user.userId; 
      const result = await reviewService.createReview(userId, req.body);
      return sendSuccess(res, 201, REVIEW_MESSAGES.CREATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await reviewService.getProductReviews(productId, req.query);
      return sendSuccess(res, 200, REVIEW_MESSAGES.GET_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = reviewController;