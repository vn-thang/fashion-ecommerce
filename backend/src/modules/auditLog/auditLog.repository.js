const prisma = require('../../config/database');

const auditLogRepository = {
  create: async data => {
    return await prisma.auditLog.create({
      data
    });
  },

  findById: async id => {
    return await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true
          }
        }
      }
    });
  },

  findAllPaginated: async ({
    search,
    userId,
    action,
    entityName,
    entityId,
    fromDate,
    toDate,
    skip,
    take
  }) => {
    const where = {};

    if (search) {
      where.OR = [
        {
          action: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          entityName: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (entityName) {
      where.entityName = entityName;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (fromDate || toDate) {
      where.createdAt = {};

      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }

      if (toDate) {
        where.createdAt.lte = new Date(toDate);
      }
    }

    const [auditLogs, totalItems] =
      await prisma.$transaction([
        prisma.auditLog.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
                role: true
              }
            }
          }
        }),

        prisma.auditLog.count({
          where
        })
      ]);

    return {
      auditLogs,
      totalItems
    };
  }
};

module.exports = auditLogRepository;