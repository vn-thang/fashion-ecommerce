const prisma = require('../../config/database');

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
    orderStatus
  }) => {
    return await prisma.$transaction(
      async (tx) => {
        const payment =
          await tx.payment.update({
            where: {
              id: paymentId
            },
            data: paymentData
          });

        const order =
          await tx.order.update({
            where: {
              id: orderId
            },
            data: {
              status: orderStatus
            }
          });

        return {
          payment,
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
};

module.exports = paymentRepository;