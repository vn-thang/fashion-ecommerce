const prisma = require('../../config/database');
const { ORDER_STATUS } = require('../order/order.constants');
const { PAYMENT_STATUS } = require('../payment/payment.constants');

const {
  LOW_STOCK_THRESHOLD,
  DASHBOARD_LIMIT
} = require('./dashboard.constants');

const dashboardRepository = {
  getSummary: async (orderWhere, startDate, endDate) => {
    const paymentWhere = {
      status: PAYMENT_STATUS.SUCCESS,
      paidAt: {
        gte: startDate,
        lte: endDate
      },
      order: {
        status: ORDER_STATUS.COMPLETED
      }
    };

    const [
      revenue,
      totalOrders,
      newCustomers,
      soldProducts,
      pendingOrders,
      shippingOrders,
      cancelledOrders,
      lowStockProducts
    ] = await Promise.all([
      // Doanh thu
      prisma.payment.aggregate({
        where: paymentWhere,
        _sum: {
          amount: true
        }
      }),

      // Tổng đơn
      prisma.order.count({
        where: orderWhere
      }),

      // Khách hàng mới
      prisma.user.count({
        where: {
          role: 'Customer',
          ...(orderWhere.createdAt && {
            createdAt: orderWhere.createdAt
          })
        }
      }),

      // Sản phẩm đã bán
      prisma.orderItem.aggregate({
        where: {
          order: {
            status: ORDER_STATUS.COMPLETED,
            payment: {
              status: PAYMENT_STATUS.SUCCESS,
              paidAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        },
        _sum: {
          quantity: true
        }
      }),

      // Chờ xác nhận
      prisma.order.count({
        where: {
          ...orderWhere,
          status: ORDER_STATUS.PENDING
        }
      }),

      // Đang giao
      prisma.order.count({
        where: {
          ...orderWhere,
          status: ORDER_STATUS.SHIPPING
        }
      }),

      // Đã hủy
      prisma.order.count({
        where: {
          ...orderWhere,
          status: ORDER_STATUS.CANCELLED
        }
      }),

      // Sắp hết hàng
   prisma.product.count({
    where: {
      status: 'ACTIVE',
      variants: {
        some: {
          status: 'ACTIVE',
          stockQuantity: {
            gt: 0,
            lte: LOW_STOCK_THRESHOLD
          }
        }
      }
    }
  })
    ]);

    return {
      revenue: Number(revenue._sum.amount || 0),
      totalOrders,
      newCustomers,
      soldProducts: soldProducts._sum.quantity || 0,
      pendingOrders,
      shippingOrders,
      cancelledOrders,
      lowStockProducts
    };
  },

  getRevenueChart: async (startDate, endDate) => {
    return prisma.$queryRaw`
      SELECT
        DATE(p."paidAt") AS "date",
        SUM(p."amount")::numeric AS "revenue"
      FROM "Payment" p
      INNER JOIN "Order" o
        ON o."id" = p."orderId"
      WHERE
        p."status" = ${PAYMENT_STATUS.SUCCESS}
        AND o."status" = ${ORDER_STATUS.COMPLETED}
        AND p."paidAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(p."paidAt")
      ORDER BY DATE(p."paidAt");
    `;
  },

  getOrderStatusChart: async orderWhere => {
    const statuses = await prisma.order.groupBy({
      by: ['status'],
      where: orderWhere,
      _count: {
        status: true
      }
    });

    const map = {};

    statuses.forEach(item => {
      map[item.status] = item._count.status;
    });

    return {
      pending: map[ORDER_STATUS.PENDING] || 0,
      processing: map[ORDER_STATUS.PROCESSING] || 0,
      shipping: map[ORDER_STATUS.SHIPPING] || 0,
      completed: map[ORDER_STATUS.COMPLETED] || 0,
      cancelled: map[ORDER_STATUS.CANCELLED] || 0,
      returned: map[ORDER_STATUS.RETURN] || 0
    };
  },

  getTopProducts: async (startDate, endDate) => {
  return prisma.orderItem.groupBy({
    by: ['productVariantId'],

    where: {
      order: {
        status: ORDER_STATUS.COMPLETED,
        payment: {
          status: PAYMENT_STATUS.SUCCESS,
          paidAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    },

    _sum: {
      quantity: true
    },

    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },

    take: DASHBOARD_LIMIT.TOP_PRODUCTS
  });
},

getProductInfo: async variantIds => {
  return prisma.productVariant.findMany({
    where: {
      id: {
        in: variantIds
      }
    },

    include: {
      product: {
        include: {
          brand: true
        }
      }
    }
  });
},

getTopCustomers: async (startDate, endDate) => {
  return prisma.user.findMany({
    where: {
      role: 'Customer'
    },

    include: {
      orders: {
        where: {
          status: ORDER_STATUS.COMPLETED,

          payment: {
            status: PAYMENT_STATUS.SUCCESS,

            paidAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },

        include: {
          payment: true
        }
      }
    }
  });
},

getBrandRevenue: async (startDate, endDate) => {
  return prisma.$queryRaw`
    SELECT
      b."id",
      b."name",
      SUM(oi."subtotal")::numeric AS "revenue"

    FROM "OrderItem" oi

    INNER JOIN "Order" o
      ON o."id" = oi."orderId"

    INNER JOIN "Payment" p
      ON p."orderId" = o."id"

    INNER JOIN "ProductVariant" pv
      ON pv."id" = oi."productVariantId"

    INNER JOIN "Product" pr
      ON pr."id" = pv."productId"

    INNER JOIN "Brand" b
      ON b."id" = pr."brandId"

    WHERE
      o."status" = ${ORDER_STATUS.COMPLETED}
      AND p."status" = ${PAYMENT_STATUS.SUCCESS}
      AND p."paidAt" BETWEEN ${startDate} AND ${endDate}

    GROUP BY
      b."id",
      b."name"

    ORDER BY
      "revenue" DESC;
    LIMIT 5;
  `;
},

getCategoryRevenue: async (startDate, endDate) => {
  return prisma.$queryRaw`
    SELECT
      COALESCE(pc."id", c."id") AS "id",

      COALESCE(pc."name", c."name") AS "name",

      SUM(oi."subtotal")::numeric AS "revenue"

    FROM "OrderItem" oi

    INNER JOIN "Order" o
      ON o."id" = oi."orderId"

    INNER JOIN "Payment" p
      ON p."orderId" = o."id"

    INNER JOIN "ProductVariant" pv
      ON pv."id" = oi."productVariantId"

    INNER JOIN "Product" pr
      ON pr."id" = pv."productId"

    INNER JOIN "Category" c
      ON c."id" = pr."categoryId"

    LEFT JOIN "Category" pc
      ON pc."id" = c."parentId"

    WHERE
      o."status" = ${ORDER_STATUS.COMPLETED}
      AND p."status" = ${PAYMENT_STATUS.SUCCESS}
      AND p."paidAt" BETWEEN ${startDate} AND ${endDate}

    GROUP BY
      COALESCE(pc."id", c."id"),
      COALESCE(pc."name", c."name")

    ORDER BY
      "revenue" DESC;
    LIMIT 5;
  `;
}
};

module.exports = dashboardRepository;