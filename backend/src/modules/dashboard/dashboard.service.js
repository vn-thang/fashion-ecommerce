const dashboardRepository = require('./dashboard.repositoty');

const dashboardService = {
  async getDashboard(query) {
    const { startDate, endDate } =
      dashboardService.buildDateRange(query);

    const where = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    };

    const [
      summary,
      revenueChart,
      orderStatusChart,

      topProductsRaw,
      topCustomersRaw,

      brandRevenue,
      categoryRevenue
    ] = await Promise.all([
      dashboardRepository.getSummary(
        where,
        startDate,
        endDate
      ),

      dashboardRepository.getRevenueChart(
        startDate,
        endDate
      ),

      dashboardRepository.getOrderStatusChart(
        where
      ),

      dashboardRepository.getTopProducts(
        startDate,
        endDate
      ),

      dashboardRepository.getTopCustomers(
        startDate,
        endDate
      ),

      dashboardRepository.getBrandRevenue(
        startDate,
        endDate
      ),

      dashboardRepository.getCategoryRevenue(
        startDate,
        endDate
      )
    ]);

    const variantIds = topProductsRaw.map(
      item => item.productVariantId
    );

    const variants =
      await dashboardRepository.getProductInfo(
        variantIds
      );

    const topProducts = topProductsRaw.map(item => {
      const variant = variants.find(
        v => v.id === item.productVariantId
      );

      return {
        variantId: item.productVariantId,

        productId: variant.product.id,

        productName: variant.product.name,

        thumbnailUrl:
          variant.product.thumbnailUrl,

        brand: variant.product.brand.name,

        color: variant.color,

        size: variant.size,

        soldQuantity:
          item._sum.quantity || 0
      };
    });

    const topCustomers = topCustomersRaw
      .map(user => {
        const totalSpent = user.orders.reduce(
          (sum, order) =>
            sum +
            Number(order.payment?.amount || 0),
          0
        );

        return {
          id: user.id,

          fullName: user.fullName,

          avatarUrl: user.avatarUrl,

          totalOrders: user.orders.length,

          totalSpent
        };
      })
      .sort(
        (a, b) =>
          b.totalSpent - a.totalSpent
      )
      .slice(0, 5);

    return {
      summary,

      revenueChart: revenueChart.map(
        item => ({
          date: item.date,
          revenue: Number(item.revenue)
        })
      ),

      orderStatusChart,

      topProducts,

      topCustomers,

      brandRevenue: brandRevenue.map(item => ({
        id: item.id,
        name: item.name,
        revenue: Number(item.revenue)
      })),

      categoryRevenue:
        categoryRevenue.map(item => ({
          id: item.id,
          name: item.name,
          revenue: Number(item.revenue)
        }))
    };
  },

  buildDateRange(query) {
    const now = new Date();

    let startDate;
    let endDate;

    if (query.startDate && query.endDate) {
      startDate = new Date(query.startDate);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate
      };
    }

    switch (query.range) {
      case 'today':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
        break;

      case '7days':
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date(endDate);
        startDate.setDate(
          startDate.getDate() - 6
        );
        startDate.setHours(0, 0, 0, 0);
        break;

      case '30days':
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date(endDate);
        startDate.setDate(
          startDate.getDate() - 29
        );
        startDate.setHours(0, 0, 0, 0);
        break;

      case 'year':
        startDate = new Date(
          now.getFullYear(),
          0,
          1
        );

        endDate = new Date(
          now.getFullYear(),
          11,
          31,
          23,
          59,
          59,
          999
        );
        break;

      case 'month':
      default:
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
    }

    return {
      startDate,
      endDate
    };
  }
};

module.exports = dashboardService;