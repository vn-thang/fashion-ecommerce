const reviewService = require('../review.service');
const { sendSuccess, sendError } = require('../../../utils/response');
const { REVIEW_MESSAGES } = require('../review.constants');

const reviewAdminController = {
  
  getAllReviews: async (req, res) => {
    try {
      const result = await reviewService.getAdminReviews(req.query);
      return sendSuccess(res, 200, REVIEW_MESSAGES.GET_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  replyReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      const result = await reviewService.replyToReview(id, reply);
      return sendSuccess(res, 200, REVIEW_MESSAGES.REPLY_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  hideReview: async (req, res) => {
    try {
      const { id } = req.params;
      await reviewService.hideReviewByAdmin(id);
      return sendSuccess(res, 200, REVIEW_MESSAGES.HIDE_SUCCESS); 
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  restoreReview: async (req, res) => {
    try {
      const { id } = req.params;
      await reviewService.restoreReviewByAdmin(id);
      return sendSuccess(res, 200, REVIEW_MESSAGES.RESTORE_SUCCESS);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = reviewAdminController;