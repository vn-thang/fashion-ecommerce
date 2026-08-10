const reviewRepository = require('./review.repository');
const { REVIEW_MESSAGES } = require('./review.constants');
const paginationHelper = require('../../utils/pagination'); 

const reviewService = {
 createReview: async (userId, data) => {
    const { orderItemId, rating, comment } = data;

    const orderItem = await reviewRepository.findOrderItemByIdAndUser(orderItemId, userId);
    if (!orderItem) {
      throw new Error(REVIEW_MESSAGES.ORDER_ITEM_NOT_FOUND);
    }

    const productId = orderItem.variant.productId;

    const existingReview = await reviewRepository.findReviewByOrderItemId(orderItemId);
    if (existingReview) {
      throw new Error(REVIEW_MESSAGES.REVIEW_EXISTS);
    }

    const newReview = await reviewRepository.createReview({
      userId,
      productId,
      orderItemId,
      rating: Number(rating), 
      comment
    });

    return newReview;
  },

 getProductReviews: async (productId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5; 
  const skip = (page - 1) * limit;

  const { reviews, total } =
    await reviewRepository.getReviewsByProductId(productId, skip, limit);

  const totalPages = Math.ceil(total / limit);

  return {
    reviews,
    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
},

getAdminReviews: async query => {
  const page = Math.max(
    parseInt(query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(query.limit, 10) || 10,
      1
    ),
    100
  );

  const skip = (page - 1) * limit;

  const {
    search,
    rating,
    status,
    fromDate,
    toDate
  } = query;

  const { reviews, total } =
    await reviewRepository.getAllReviewsForAdmin({
      skip,
      limit,
      search,
      rating,
      status,
      fromDate,
      toDate
    });

  return {
    reviews,

    pagination: {
      currentPage: page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    }
  };
},

  replyToReview: async (reviewId, replyText) => {
    if (!replyText || replyText.trim() === '') {
      throw new Error(REVIEW_MESSAGES.REPLY_REQUIRED);
    }

    const review = await reviewRepository.findReviewById(reviewId);
    if (!review) {
      throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
    }

    return await reviewRepository.updateReply(reviewId, replyText);
  },

hideReviewByAdmin: async (reviewId) => {
  const review = await reviewRepository.findReviewById(reviewId);

  if (!review) {
    throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
  }

  if (review.isHidden) {
    return review;
  }

  return await reviewRepository.hideReview(reviewId);
},
restoreReviewByAdmin: async (reviewId) => {
  const review = await reviewRepository.findReviewById(reviewId);

  if (!review) {
    throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
  }

  if (!review.isHidden) {
    return review;
  }

  return await reviewRepository.restoreReview(reviewId);
},
};

module.exports = reviewService;