const prisma = require('../../config/database');

const reviewRepository = {

  findOrderItemByIdAndUser: async (orderItemId, userId) => {
    return await prisma.orderItem.findFirst({
      where: { 
        id: orderItemId,
        order: { userId: userId }
      },
      include: {
        variant: {
          include: { product: true }
        }
      }
    });
  },

  findReviewByOrderItemId: async (orderItemId) => {
    return await prisma.review.findFirst({
      where: { orderItemId: orderItemId }
    });
  },

createReview: async (reviewData) => {
  return await prisma.$transaction(async (tx) => {

    const newReview = await tx.review.create({
      data: reviewData
    });

    await reviewRepository.updateProductReviewStats(reviewData.productId, tx);

    return newReview;
  });
},

getReviewsByProductId: async (
  productId,
  skip,
  limit,
  filters = {}
) => {
  const whereCondition = {
    productId,
    isHidden: false
  };

  if (filters.rating) {
    whereCondition.rating = filters.rating;
  }

  if (filters.hasComment === true) {
    whereCondition.comment = {
      not: null
    };
  }

  if (filters.hasComment === false) {
    whereCondition.comment = null;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        },
        orderItem: {
          select: {
            variant: {
              select: {
                color: true,
                size: true
              }
            }
          }
        }
      }
    }),

    prisma.review.count({
      where: whereCondition
    })
  ]);

  return {
    reviews,
    total
  };
},

getAllReviewsForAdmin: async ({
  skip,
  limit,
  search,
  rating,
  status,
  fromDate,
  toDate
}) => {
  const where = {};

  if (rating) {
    where.rating = Number(rating);
  }

  if (status === 'REPLIED') {
    where.reply = {
      not: null
    };
  }

  if (status === 'NOT_REPLIED') {
    where.reply = null;
  }

  if (status === 'HIDDEN') {
    where.isHidden = true;
  }

  if (status === 'VISIBLE') {
    where.isHidden = false;
  }

  if (search?.trim()) {
    const keyword = search.trim();

    where.OR = [
      {
        comment: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      {
        reply: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      {
        user: {
          fullName: {
            contains: keyword,
            mode: 'insensitive'
          }
        }
      },
      {
        user: {
          email: {
            contains: keyword,
            mode: 'insensitive'
          }
        }
      },
      {
        product: {
          name: {
            contains: keyword,
            mode: 'insensitive'
          }
        }
      }
    ];
  }

  if (fromDate || toDate) {
    where.createdAt = {};

    if (fromDate) {
      where.createdAt.gte = new Date(`${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      where.createdAt.lte = new Date(`${toDate}T23:59:59.999Z`);
    }
  }

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        },

        product: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true
          }
        },

        orderItem: {
          select: {
            variant: {
              select: {
                color: true,
                size: true
              }
            }
          }
        }
      }
    }),

    prisma.review.count({
      where
    })
  ]);

  return {
    reviews,
    total
  };
},

  findReviewById: async (id) => {
    return await prisma.review.findUnique({ where: { id } });
  },

  updateReply: async (id, replyText) => {
    return await prisma.review.update({
      where: { id },
      data: {
        reply: replyText,
        repliedAt: new Date()
      }
    });
  },

hideReview: async (id) => {
  return await prisma.$transaction(async (tx) => {

    const review = await tx.review.update({
      where: { id },
      data: {
        isHidden: true
      }
    });

    await reviewRepository.updateProductReviewStats(review.productId, tx);

    return review;
  });
},

restoreReview: async (id) => {
  return await prisma.$transaction(async (tx) => {

    const review = await tx.review.update({
      where: { id },
      data: {
        isHidden: false
      }
    });

    await reviewRepository.updateProductReviewStats(review.productId, tx);

    return review;
  });
},

updateProductReviewStats: async (productId, tx = prisma) => {
  const stats = await tx.review.aggregate({
    where: {
      productId,
      isHidden: false 
    },
    _count: {
      id: true
    },
    _avg: {
      rating: true
    }
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      reviewCount: stats._count.id,
      rating: stats._avg.rating || 0
    }
  });
}
};

module.exports = reviewRepository;