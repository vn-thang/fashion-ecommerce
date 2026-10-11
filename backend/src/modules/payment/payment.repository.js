const prisma = require('../../config/database');
const orderRepository = require('../order/order.repository');
const { PAYMENT_STATUS } = require('../../constants/paymentStatus.constant');
const { ORDER_STATUS, ORDER_STATUS_CHANGE_SOURCE } = require('../order/order.constants');

const paymentRepository = {
  findOrderById: async (orderId) => {
    return await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        payment: true,
        user: true,
        items: true
      }
    });
  },

  findOrderByIdAndUser: async (
    orderId,
    userId
  ) => {
    return await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        payment: true,
        user: true,
        items: true
      }
    });
  },

  findOrderByOrderNumber: async (
    orderNumber
  ) => {
    return await prisma.order.findUnique({
      where: {
        orderNumber
      },
      include: {
        payment: true,
        user: true,
        items: true
      }
    });
  },

  findPaymentById: async (
    paymentId
  ) => {
    return await prisma.payment.findUnique({
      where: {
        id: paymentId
      },
      include: {
        order: true
      }
    });
  },

  findPaymentByOrderId: async (
    orderId
  ) => {
    return await prisma.payment.findUnique({
      where: {
        orderId
      },
      include: {
        order: true
      }
    });
  },

  findPaymentByTransactionRef: async (
    transactionRef
  ) => {
    return await prisma.payment.findFirst({
      where: {
        transactionRef
      },
      include: {
        order: true
      }
    });
  },

  findPaymentByTransactionNo: async (
    transactionNo
  ) => {
    return await prisma.payment.findFirst({
      where: {
        transactionNo
      },
      include: {
        order: true
      }
    });
  },

  updatePayment: async (
    paymentId,
    paymentData
  ) => {
    return await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: paymentData
    });
  },

  updatePaymentAndOrderTransaction: async ({
    paymentId,
    paymentData,
    orderId,
    orderStatus,
    restoreResources = false
  }) => {
    return await prisma.$transaction(
      async (tx) => {
        const transition = await tx.payment.updateMany({
          where: {
            id: paymentId,
            status: PAYMENT_STATUS.PENDING
          },
          data: paymentData
        });

        if (transition.count === 0) {
          const [payment, order] = await Promise.all([
            tx.payment.findUnique({
              where: { id: paymentId }
            }),
            tx.order.findUnique({
              where: { id: orderId },
              include: { payment: true }
            })
          ]);

          return {
            processed: false,
            payment,
            order
          };
        }

        if (restoreResources) {
          await orderRepository.restoreOrderResourcesWithinTransaction(
            tx,
            orderId,
            { restoreCoupon: true }
          );
        } else {
          const order = await tx.order.findUnique({
            where: {
              id: orderId
            },
            select: {
              userId: true,
              items: {
                select: { productVariantId: true }
              }
            }
          });

          const variantIds = order.items.map(
            item => item.productVariantId
          );

          if (variantIds.length > 0) {
            await tx.cartItem.deleteMany({
              where: {
                productVariantId: { in: variantIds },
                cart: { userId: order.userId }
              }
            });
          }
        }

        const order =
          await orderRepository.transitionOrderStatusWithinTransaction(
            tx,
            {
              orderId,
              fromStatus: ORDER_STATUS.PENDING,
              toStatus: orderStatus,
              source: ORDER_STATUS_CHANGE_SOURCE.SYSTEM,
              note:
                paymentData.status === PAYMENT_STATUS.SUCCESS
                  ? 'VNPay xác nhận thanh toán thành công.'
                  : `VNPay trả kết quả thanh toán: ${paymentData.status}.`
            }
          );

        if (!order) {
          throw new Error(
            'Trạng thái đơn hàng đã thay đổi trước khi xử lý kết quả thanh toán.'
          );
        }

        return {
          processed: true,
          payment: order.payment,
          order
        };
      }
    );
  },

  findPayments: async ({
  skip,
  limit,
  where
}) => {
  const [payments, totalItems] =
    await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
      include: {
  order: {
    select: {
      id: true,
      orderNumber: true,
      status: true,
      receiverName: true,
      phoneNumber: true,
      totalAmount: true,
      createdAt: true,

      user: {
        select: {
          fullName: true,
          email: true
        }
      }
    }
  }
}
      }),
      prisma.payment.count({
        where
      })
    ]);

  return {
    payments,
    totalItems
  };
},

findPaymentDetail: async (
  paymentId
) => {
  return await prisma.payment.findUnique({
    where: {
      id: paymentId
    },
    include: {
      order: {
        include: {
          user: true,
          items: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      }
    }
  });
},

updateRefundAmount: async (
  paymentId,
  refundedAmount,
  status
) => {
  return await prisma.payment.update({
    where: {
      id: paymentId
    },
    data: {
      refundedAmount,
      status
    }
  });
},
};

module.exports = paymentRepository;