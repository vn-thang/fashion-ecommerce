const reviewRepository = require('./review.repository');
const { REVIEW_MESSAGES } = require('./review.constants');
const paginationHelper = require('../../utils/pagination'); 
const auditLogService = require('../auditLog/auditLog.service');
const notificationService = require('../notification/notification.service');
const { TYPE } = require('../notification/notification.constants');

const reviewService = {
createReview: async (userId, data) => {
  const { orderItemId, rating, comment } = data;

  const orderItem =
    await reviewRepository.findOrderItemByIdAndUser(
      orderItemId,
      userId
    );

  if (!orderItem) {
    throw new Error(REVIEW_MESSAGES.ORDER_ITEM_NOT_FOUND);
  }

  const productId = orderItem.variant.productId;

  const existingReview =
    await reviewRepository.findReviewByOrderItemId(
      orderItemId
    );

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

  try {
    await notificationService.notifyAdmins({
      title: NOTIFICATION_ADMIN.NEW_REVIEW_TITLE,
      content: NOTIFICATION_ADMIN.NEW_REVIEW_CONTENT(
        orderItem.variant.product.name
      ),
      type: TYPE.ADMIN_NEW_REVIEW,
      data: {
        reviewId: newReview.id,
        productId,
        orderItemId
      }
    });
  } catch (error) {
    console.error(
      '[NOTIFICATION] New review notification failed:',
      error.message
    );
  }

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

 replyToReview: async (adminId, reviewId, replyText) => {
  if (!replyText || replyText.trim() === '') {
    throw new Error(REVIEW_MESSAGES.REPLY_REQUIRED);
  }

  const review = await reviewRepository.findReviewById(reviewId);

  if (!review) {
    throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
  }

  const updatedReview = await reviewRepository.updateReply(
    reviewId,
    replyText
  );

  await auditLogService.createAuditLog({
    userId: adminId,
    action: 'REPLY_REVIEW',
    entityName: 'Review',
    entityId: reviewId,
    oldValues: {
      reply: review.reply
    },
    newValues: {
      reply: updatedReview.reply
    }
  });

  await notificationService.createNotification({
    userId: review.userId,
    title: 'Cửa hàng đã phản hồi đánh giá',
    content: 'Đánh giá của bạn đã nhận được phản hồi từ cửa hàng.',
    type: TYPE.REVIEW_REPLY,
    data: {
      reviewId: review.id,
      productId: review.productId
    }
  });

  return updatedReview;
},
  hideReviewByAdmin: async (adminId, reviewId) => {
    const review =
      await reviewRepository.findReviewById(reviewId);

    if (!review) {
      throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
    }

    if (review.isHidden) {
      return review;
    }

    const updatedReview =
      await reviewRepository.hideReview(reviewId);

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'HIDE_REVIEW',
      entityName: 'Review',
      entityId: reviewId,
      oldValues: {
        isHidden: review.isHidden
      },
      newValues: {
        isHidden: updatedReview.isHidden
      }
    });

    return updatedReview;
  },

  restoreReviewByAdmin: async (adminId, reviewId) => {
    const review =
      await reviewRepository.findReviewById(reviewId);

    if (!review) {
      throw new Error(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
    }

    if (!review.isHidden) {
      return review;
    }

    const updatedReview =
      await reviewRepository.restoreReview(reviewId);

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'RESTORE_REVIEW',
      entityName: 'Review',
      entityId: reviewId,
      oldValues: {
        isHidden: review.isHidden
      },
      newValues: {
        isHidden: updatedReview.isHidden
      }
    });

    return updatedReview;
  }
};

module.exports = reviewService;