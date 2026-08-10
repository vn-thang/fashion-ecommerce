const prisma = require('../../config/database');

const couponRepository = {
  create: async data => {
    return prisma.coupon.create({ data });
  },

  findAllPaginated: async ({
    search,
    discountType,
    status,
    fromDate,
    toDate,
    isActive,
    skip,
    take,
    userId
  }) => {
    const now = new Date();
    const where = {};

    if (search?.trim()) {
      where.code = {
        contains: search.trim(),
        mode: 'insensitive'
      };
    }

    if (discountType) {
      where.discountType = discountType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === true || isActive === 'true';
    }

    if (status) {
      if (status === 'ACTIVE') {
        where.isActive = true;
        where.startDate = { lte: now };
        where.endDate = { gte: now };
      }

      if (status === 'UPCOMING') {
        where.isActive = true;
        where.startDate = { gt: now };
      }

      if (status === 'EXPIRED') {
        where.isActive = true;
        where.endDate = { lt: now };
      }

      if (status === 'INACTIVE') {
        where.isActive = false;
      }
    }

    if (fromDate || toDate) {
      where.startDate = {
        ...(where.startDate || {}),
        ...(fromDate ? { gte: new Date(fromDate) } : {})
      };

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        where.endDate = {
          ...(where.endDate || {}),
          lte: endDate
        };
      }
    }

    const includeConfig = userId
      ? {
          usages: {
            where: { userId }
          }
        }
      : undefined;

    const [coupons, totalItems] = await prisma.$transaction([
      prisma.coupon.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: 'desc' },
        include: includeConfig
      }),
      prisma.coupon.count({ where })
    ]);

    return { coupons, totalItems };
  },

  findById: async id => {
    return prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { usages: true }
        }
      }
    });
  },

  findByCode: async code => {
    return prisma.coupon.findUnique({
      where: { code }
    });
  },

  update: async (id, data) => {
    return prisma.coupon.update({
      where: { id },
      data
    });
  },

deactivate: async id => {
  return prisma.coupon.update({
    where: { id },
    data: {
      isActive: false
    }
  });
}
};

module.exports = couponRepository;