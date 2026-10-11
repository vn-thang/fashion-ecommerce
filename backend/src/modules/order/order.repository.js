const prisma = require('../../config/database');
const { PAYMENT_STATUS, PAYMENT_METHOD } = require('../../constants/paymentStatus.constant');
const { ORDER_STATUS } = require('../../constants/orderStatus.constant');
const { ORDER_MESSAGES, ORDER_STATUS_CHANGE_SOURCE, ORDER_CANCELLED_BY } = require('./order.constants');

const restoreOrderResourcesWithinTransaction = async (
  tx,
  orderId,
  { restoreCoupon = true, allowCancelled = false } = {}
) => {
  const order = await tx.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      payment: true,
      items: true,
      couponUsages: true
    }
  });

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng.');
  }

  if (
    order.status === ORDER_STATUS.CANCELLED &&
    !allowCancelled
  ) {
    return order;
  }

  for (const item of order.items) {
    const updatedVariant = await tx.productVariant.update({
      where: {
        id: item.productVariantId
      },
      data: {
        stockQuantity: {
          increment: item.quantity
        }
      }
    });

    const newStock = updatedVariant.stockQuantity;

    if (item.flashSaleVariantId) {
      await tx.flashSaleVariant.update({
        where: {
          id: item.flashSaleVariantId
        },
        data: {
          flashSaleStock: {
            increment: item.quantity
          }
        }
      });
    }

    await tx.inventoryTransaction.create({
      data: {
        productVariantId: item.productVariantId,
        type: 'Import',
        quantity: item.quantity,
        balanceAfter: newStock,
        note: `Hoàn kho do hủy đơn ${order.orderNumber}`,
        createdBy: order.userId
      }
    });
  }

  if (restoreCoupon) {
    const usage = order.couponUsages[0];

    if (usage) {
      await tx.coupon.update({
        where: {
          id: usage.couponId
        },
        data: {
          usedCount: {
            decrement: 1
          }
        }
      });

      await tx.couponUsage.delete({
        where: {
          id: usage.id
        }
      });
    }
  }

  return true;
};

const transitionOrderStatusWithinTransaction = async (
  tx,
  {
    orderId,
    fromStatus,
    toStatus,
    source,
    note = null,
    orderData = {},
    incrementSoldCountOnCompletion = false
  }
) => {
  const transition = await tx.order.updateMany({
    where: {
      id: orderId,
      status: fromStatus
    },
    data: {
      ...orderData,
      status: toStatus
    }
  });

  if (transition.count === 0) {
    return null;
  }

  if (fromStatus !== toStatus) {
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        source,
        note,
        changedAt: new Date()
      }
    });

    if (
      incrementSoldCountOnCompletion &&
      toStatus === ORDER_STATUS.COMPLETED
    ) {
      const items = await tx.orderItem.findMany({
        where: {
          orderId
        },
        select: {
          quantity: true,
          flashSaleVariantId: true,
          variant: {
            select: {
              productId: true
            }
          }
        }
      });

      for (const item of items) {
        if (item.variant?.productId) {
          await tx.product.update({
            where: {
              id: item.variant.productId
            },
            data: {
              soldCount: {
                increment: item.quantity
              }
            }
          });
        }

        if (item.flashSaleVariantId) {
          await tx.flashSaleVariant.update({
            where: {
              id: item.flashSaleVariantId
            },
            data: {
              soldCount: {
                increment: item.quantity
              }
            }
          });
        }
      }
    }
  }

  return await tx.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      payment: true
    }
  });
};

const orderRepository = {
  restoreOrderResourcesWithinTransaction,
  transitionOrderStatusWithinTransaction,

  transitionOrderStatus: async options =>
    prisma.$transaction(tx =>
      transitionOrderStatusWithinTransaction(tx, options)
    ),

  findShippingSimulationCandidates: async () =>
    prisma.order.findMany({
      where: {
        status: {
          in: [
            ORDER_STATUS.PROCESSING,
            ORDER_STATUS.SHIPPING
          ]
        }
      },
      include: {
        payment: true,
        statusHistory: {
          orderBy: [
            { changedAt: 'desc' },
            { id: 'desc' }
          ],
          take: 1
        }
      }
    }),

  findSelectedCartItems: async (userId, cartItemIds) => {
    return await prisma.cartItem.findMany({
      where: { id: { in: cartItemIds }, cart: { userId: userId } },
      include: {
       variant: {
        include: {
          product: true,
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true
              }
            },
            include: {
              flashSale: true
            },
            take: 1
          }
        }
      }
      }
    });
  },

  findBuyNowItems: async (buyNowItems) => {
    const variantIds = buyNowItems.map(item => item.variantId);
    
  const variants = await prisma.productVariant.findMany({
  where:{
    id:{ in: variantIds }
  },
  include:{
    product:true,
    flashSaleVariants:{
      where:{
        flashSale:{
          isActive:true
        }
      },
      include:{
        flashSale:true
      },
      take:1
    }
  }
});

    return buyNowItems.map(reqItem => {
      const variant = variants.find(v => v.id === reqItem.variantId);
      if (!variant) throw new Error(`Không tìm thấy sản phẩm có ID: ${reqItem.variantId}`);
      
      return {
        productVariantId: variant.id,
        quantity: reqItem.quantity,
        variant: variant 
      };
    });
  },

  findCouponByCode: async (code) => {
    return await prisma.coupon.findUnique({ where: { code } });
  },

  checkUserCouponUsage: async (userId, couponId) => {
    const usage = await prisma.couponUsage.findFirst({
      where: { userId: userId, couponId: couponId }
    });
   return usage;
  },

createOrderTransaction: async ({
  orderData,
  orderItemsData,
  cartItemIds,
  couponId,
  userId,
  paymentMethod,
  idempotencyKey,
  requestHash
}) => {
  const findMatchingRequest = async client => {
    const existingOrder = await client.order.findFirst({
      where: {
        userId,
        idempotencyKey
      },
      include: {
        payment: true
      }
    });

    if (!existingOrder) {
      return null;
    }

    if (existingOrder.requestHash !== requestHash) {
      const error = new Error(ORDER_MESSAGES.IDEMPOTENCY_KEY_REUSED);
      error.statusCode = 409;
      throw error;
    }

    return {
      order: existingOrder,
      lowStockVariants: [],
      replayed: true
    };
  };

  try {
    return await prisma.$transaction(async tx => {
    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${userId}),
        hashtext(${idempotencyKey})
      )
    `;

    const existingRequest = await findMatchingRequest(tx);
    if (existingRequest) {
      return existingRequest;
    }

    const lowStockVariants = [];

    if (couponId) {
      const coupon = await tx.coupon.findUnique({
        where: { id: couponId }
      });

      const now = new Date();

      if (
        !coupon ||
        !coupon.isActive ||
        now < coupon.startDate ||
        now > coupon.endDate
      ) {
        throw new Error(ORDER_MESSAGES.COUPON_INVALID);
      }

      if (Number(orderData.subtotal) < Number(coupon.minOrderAmount)) {
        throw new Error(ORDER_MESSAGES.COUPON_MIN_NOT_MET);
      }

      const existingUsage = await tx.couponUsage.findFirst({
        where: {
          couponId,
          userId
        },
        select: { id: true }
      });

      if (existingUsage) {
        throw new Error(ORDER_MESSAGES.COUPON_ALREADY_USED);
      }

      const couponReservation = await tx.coupon.updateMany({
        where: {
          id: couponId,
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
          minOrderAmount: { lte: orderData.subtotal },
          usedCount: { lt: coupon.usageLimit }
        },
        data: {
          usedCount: { increment: 1 }
        }
      });

      if (couponReservation.count === 0) {
        throw new Error(ORDER_MESSAGES.COUPON_EXHAUSTED);
      }
    }

    for (const item of orderItemsData) {
      const variant = await tx.productVariant.findUnique({
        where: {
          id: item.productVariantId
        }
      });

      if (!variant || variant.status !== 'ACTIVE') {
        throw new Error(
          `Sản phẩm [${item.productName}] hiện tại không còn tồn tại hoặc đã ngừng bán!`
        );
      }
      const stockUpdate = await tx.productVariant.updateMany({
        where: {
          id: item.productVariantId,
          status: 'ACTIVE',
          stockQuantity: {
            gte: item.quantity
          }
        },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });

      if (stockUpdate.count === 0) {
        throw new Error(
          `Sản phẩm [${item.productName}] (Màu: ${
            item.color || 'N/A'
          }, Size: ${item.size || 'N/A'}) chỉ còn ${
            variant.stockQuantity
          } sản phẩm trong kho. Không đủ đáp ứng số lượng bạn yêu cầu!`
        );
      }

      if (item.flashSaleVariantId) {
        const flashSaleVariant =
          await tx.flashSaleVariant.findUnique({
            where: {
              id: item.flashSaleVariantId
            }
          });

        if (!flashSaleVariant) {
          throw new Error(
            `Flash Sale của sản phẩm [${item.productName}] không tồn tại!`
          );
        }

        const flashSaleStockUpdate =
          await tx.flashSaleVariant.updateMany({
            where: {
              id: item.flashSaleVariantId,
              flashSaleStock: {
                gte: item.quantity
              }
            },
            data: {
              flashSaleStock: {
                decrement: item.quantity
              }
            }
          });

        if (flashSaleStockUpdate.count === 0) {
          throw new Error(
            `Flash Sale của sản phẩm [${item.productName}] chỉ còn ${flashSaleVariant.flashSaleStock} sản phẩm.`
          );
        }
      }

      const remainingStock =
        variant.stockQuantity - item.quantity;

      await tx.inventoryTransaction.create({
        data: {
          productVariantId: item.productVariantId,
          type: 'Export',
          quantity: item.quantity,
          balanceAfter: remainingStock,
          note: `Xuất kho tự động phục vụ đơn hàng: ${orderData.orderNumber}`,
          createdBy: userId
        }
      });

      const LOW_STOCK_THRESHOLD = 5;

      if (
        variant.stockQuantity > LOW_STOCK_THRESHOLD &&
        remainingStock <= LOW_STOCK_THRESHOLD
      ) {
        lowStockVariants.push({
          productId: variant.productId,
          variantId: variant.id,
          productName: item.productName,
          color: item.color,
          size: item.size,
          stockQuantity: remainingStock
        });
      }
    }

    const order = await tx.order.create({
      data: {
        ...orderData,
        idempotencyKey,
        requestHash
      }
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        oldStatus: null,
        newStatus: order.status,
        source: ORDER_STATUS_CHANGE_SOURCE.SYSTEM,
        note: 'Đơn hàng được tạo.',
        changedAt: new Date()
      }
    });

    const itemsWithOrderId = orderItemsData.map(item => ({
      orderId: order.id,
      productVariantId: item.productVariantId,
      flashSaleVariantId: item.flashSaleVariantId,
      productName: item.productName,
      color: item.color,
      size: item.size,
      originalPrice: item.originalPrice,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      discountAmount: item.discountAmount
    }));

    await tx.orderItem.createMany({
      data: itemsWithOrderId
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        paymentMethod,
        status: PAYMENT_STATUS.PENDING,
        amount: orderData.totalAmount
      }
    });

    if (
      paymentMethod === PAYMENT_METHOD.COD &&
      cartItemIds?.length
    ) {
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: cartItemIds
          }
        }
      });
    }

    if (couponId) {
      try {
        await tx.couponUsage.create({
          data: {
            couponId,
            userId,
            orderId: order.id
          }
        });
      } catch (error) {
        if (error.code === 'P2002') {
          throw new Error(ORDER_MESSAGES.COUPON_ALREADY_USED);
        }
        throw error;
      }
    }

    const createdOrder = await tx.order.findUnique({
      where: {
        id: order.id
      },
      include: {
        payment: true
      }
    });

    return {
      order: createdOrder,
      lowStockVariants,
      replayed: false
    };
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const existingRequest = await findMatchingRequest(prisma);
      if (existingRequest) {
        return existingRequest;
      }
    }

    throw error;
  }
},

findOrderByIdempotencyKey: async (userId, idempotencyKey) =>
  prisma.order.findFirst({
    where: {
      userId,
      idempotencyKey
    },
    include: {
      payment: true
    }
  }),

findOrdersByUserId: async (userId, skip, limit, status) => {
  const whereCondition = { userId: userId };
  if (status && status.trim() !== '') {
    whereCondition.status = status;
  }

  const total = await prisma.order.count({ where: whereCondition });
  
  const data = await prisma.order.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          },
          reviews: true
        }
      },
      payment: true,
      returnRequests: {
        select: {
          id: true,
          status: true,
          reason: true,
          refundAmount: true,
          createdAt: true,
          completedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  return { data, total };
},

  findOrderById: async (orderId, userId) => {
  return await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          },
          reviews: true
        }
      },
      payment: true,
      returnRequests: {
        select: {
          id: true,
          status: true,
          reason: true,
          refundAmount: true,
          createdAt: true,
          completedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      statusHistory: {
        orderBy: [
          { changedAt: 'asc' },
          { id: 'asc' }
        ]
      }
    }
  });
},

findOrdersForAdmin: async ({ skip, limit, where }) => {
  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        payment: {
          select: {
            paymentMethod: true,
            status: true,
            amount: true,
            paidAt: true
          }
        }
      }
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    totalItems
  };
},

findOrderDetailForAdmin: async (orderId) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      user: {
        select: {
          email: true,
          fullName: true
        }
      },
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      },
      payment: true,
      couponUsages: true
    }
  });
},

findOrderForCancel: async (orderId) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      items: true,
      payment: true
    }
  });
},
cancelOrderTransaction: async ({
  orderId,
  expectedStatus,
  paymentId,
  paymentStatus,
  cancelledBy,
  cancelReason
}) => {
  return await prisma.$transaction(async tx => {
    const order = await transitionOrderStatusWithinTransaction(
      tx,
      {
        orderId,
        fromStatus: expectedStatus,
        toStatus: ORDER_STATUS.CANCELLED,
        source:
          cancelledBy === ORDER_CANCELLED_BY.ADMIN
            ? ORDER_STATUS_CHANGE_SOURCE.ADMIN
            : ORDER_STATUS_CHANGE_SOURCE.SYSTEM,
        note:
          cancelledBy === ORDER_CANCELLED_BY.CUSTOMER
            ? `Khách hàng yêu cầu hủy đơn. Lý do: ${cancelReason}`
            : cancelReason,
        orderData: {
          cancelledAt: new Date(),
          cancelledBy,
          cancelReason
        }
      }
    );

    if (!order) {
      return {
        transitioned: false
      };
    }

    await restoreOrderResourcesWithinTransaction(
      tx,
      orderId,
      {
        restoreCoupon: true,
        allowCancelled: true
      }
    );

    await tx.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: paymentStatus
      }
    });

    return {
      transitioned: true,
      order
    };
  });
},

findExpiredPendingOrders: async (expiredTime) => {
  return await prisma.order.findMany({
    where: {
      status: ORDER_STATUS.PENDING,
      createdAt: {
        lte: expiredTime
      },
      payment: {
        paymentMethod: PAYMENT_METHOD.VNPAY,
        status: PAYMENT_STATUS.PENDING
      }
    },
    include: {
      payment: true,
      items: true
    }
  });
},

restoreOrderResourcesTransaction: async (
  orderId,
  options = {}
) => {
  return prisma.$transaction(tx =>
    restoreOrderResourcesWithinTransaction(
      tx,
      orderId,
      options
    )
  );
},
deleteCartItemsByOrder: async (orderId) => {

  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      items: {
        select: {
          productVariantId: true
        }
      }
    }
  });

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng.');
  }

  const variantIds = order.items.map(
    item => item.productVariantId
  );

  if (!variantIds.length) {
    return;
  }

  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        userId: order.userId
      },
      productVariantId: {
        in: variantIds
      }
    }
  });

},
};

module.exports = orderRepository;