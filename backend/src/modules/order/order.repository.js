const prisma = require('../../config/database');
const { PAYMENT_STATUS, PAYMENT_METHOD } = require('../../constants/paymentStatus.constant');
const { ORDER_STATUS } = require('../../constants/orderStatus.constant');

const orderRepository = {
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
  paymentMethod
}) => {
  return await prisma.$transaction(async tx => {
    const lowStockVariants = [];

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
        },
        soldCount: {
          increment: item.quantity
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
      data: orderData
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
  await tx.couponUsage.create({
    data: {
      couponId,
      userId,
      orderId: order.id
    }
  });

  await tx.coupon.update({
    where: {
      id: couponId
    },
    data: {
      usedCount: {
        increment: 1
      }
    }
  });
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
      lowStockVariants
    };
  });
},

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
  paymentId,
  paymentStatus,
  cancelledBy,
  cancelReason
}) => {
  return await prisma.$transaction(async tx => {
    await tx.order.update({
      where: {
        id: orderId
      },
      data: {
        status: ORDER_STATUS.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy,
        cancelReason
      }
    });

    await tx.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: paymentStatus
      }
    });

    return true;
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

restoreOrderResourcesTransaction: async (orderId, { restoreCoupon = true } = {}) => {
  return await prisma.$transaction(async tx => {
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

    if (order.status === ORDER_STATUS.CANCELLED) {
      return order;
    }

    for (const item of order.items) {
      await tx.productVariant.update({
        where: {
          id: item.productVariantId
        },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });

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
  });
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