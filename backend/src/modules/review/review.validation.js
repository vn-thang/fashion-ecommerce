const { REVIEW_MESSAGES } = require('./review.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const reviewValidation = {
  validateCreateReview: (req, res, next) => {
    const { orderItemId, rating } = req.body;

    if (!orderItemId || !validateUUID(orderItemId)) {
      return res.status(400).json({ success: false, message: REVIEW_MESSAGES.INVALID_ID });
    }

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: REVIEW_MESSAGES.RATING_REQUIRED });
    }
    
    next();
  },

  validateProductId: (req, res, next) => {
    const { productId } = req.params;
    if (!validateUUID(productId)) {
      return res.status(400).json({ success: false, message: REVIEW_MESSAGES.INVALID_ID });
    }
    next();
  }
};

module.exports = reviewValidation;