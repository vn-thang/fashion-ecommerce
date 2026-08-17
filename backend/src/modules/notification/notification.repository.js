const prisma = require('../../config/database');
const { ROLES } = require('../auth/auth.constants'); 

const notificationRepository = {
  create: async (data) => {
    return await prisma.notification.create({
      data
    });
  },

  findAllByUser: async ({ userId, skip, take }) => {
    const where = { userId };

    const [notifications, totalItems] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    return { notifications, totalItems };
  },

  countUnreadByUser: async (userId) => {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  },

  findById: async (id) => {
    return await prisma.notification.findUnique({
      where: { id }
    });
  },

  markAsRead: async (id, userId) => {
    return await prisma.notification.updateMany({
      where: {
        id,
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  },

  markAllAsRead: async (userId) => {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  },
saveDeviceToken: async ({ userId, token, deviceType }) => {
  return await prisma.userDevice.upsert({
    where: { token },
    update: {
      userId,
      deviceType
    },
    create: {
      userId,
      token,
      deviceType
    }
  });
},

removeDeviceToken: async ({ userId, token }) => {
  return await prisma.userDevice.deleteMany({
    where: {
      userId,
      token
    }
  });
},

findDevicesByUserId: async userId => {
  return await prisma.userDevice.findMany({
    where: { userId },
    select: {
      id: true,
      token: true,
      deviceType: true
    }
  });
},

findAllUserIds: async () => {
  return await prisma.user.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true
    }
  });
},

  findAdminUsers: async () => {
    return await prisma.user.findMany({
      where: {
        role: ROLES.ADMIN,
        isActive: true
      },
      select: {
        id: true
      }
    });
  },
};

module.exports = notificationRepository;