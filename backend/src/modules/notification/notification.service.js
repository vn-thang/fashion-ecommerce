const notificationRepository = require('./notification.repository');
const { MESSAGES } = require('./notification.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');
const fcmService = require('./fcm.service');

const DEFAULT_LIMIT = 10;

const notificationService = {
  createNotification: async ({ userId, title, content, type, data = {} }) => {
    if (!userId) {
      throw new Error(MESSAGES.USER_ID_REQUIRED);
    }

    if (!title || !title.trim()) {
      throw new Error(MESSAGES.TITLE_REQUIRED);
    }

    if (!content || !content.trim()) {
      throw new Error(MESSAGES.CONTENT_REQUIRED);
    }

    const notification = await notificationRepository.create({
      userId,
      title: title.trim(),
      content: content.trim(),
      type
    });

    const devices = await notificationRepository.findDevicesByUserId(userId);
    await Promise.allSettled(
      devices.map(async device => {
        try {
          await fcmService.sendToToken({
            token: device.token,
            title: title.trim(),
            body: content.trim(),
            data: {
              ...data,
              notificationId: notification.id,
              type
            }
          });
        } catch (error) {
          console.error(
            `FCM failed for device ${device.id}:`,
            error.message
          );

          if (
            error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token'
          ) {
            await notificationRepository.removeDeviceToken({
              userId,
              token: device.token
            });
          }
        }
      })
    );

    return notification;
  },

  getMyNotifications: async (userId, queryParams = {}) => {
    const { page: rawPage, limit: rawLimit } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const [{ notifications, totalItems }, unreadCount] = await Promise.all([
      notificationRepository.findAllByUser({
        userId,
        skip,
        take: limit
      }),
      notificationRepository.countUnreadByUser(userId)
    ]);

    return {
      notifications,
      unreadCount,
      pagination: getPaginationMetadata(totalItems, page, limit)
    };
  },

  getUnreadCount: async userId => {
    return await notificationRepository.countUnreadByUser(userId);
  },

  markAsRead: async (id, userId) => {
    const notification = await notificationRepository.findById(id);

    if (!notification || notification.userId !== userId) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (notification.isRead) {
      return notification;
    }

    await notificationRepository.markAsRead(id, userId);

    return {
      ...notification,
      isRead: true
    };
  },

  markAllAsRead: async userId => {
    return await notificationRepository.markAllAsRead(userId);
  },

  registerDeviceToken: async ({ userId, token, deviceType }) => {
    if (!token) {
      throw new Error(MESSAGES.TOKEN_REQUIRED);
    }

    return await notificationRepository.saveDeviceToken({
      userId,
      token,
      deviceType
    });
  },

  removeDeviceToken: async ({ userId, token }) => {
    if (!token) {
      throw new Error(MESSAGES.TOKEN_REQUIRED);
    }

    return await notificationRepository.removeDeviceToken({
      userId,
      token
    });
  },

  notifyAllUsers: async ({
  title,
  content,
  type,
  data = {}
}) => {
  if (!title || !title.trim()) {
    throw new Error(MESSAGES.TITLE_REQUIRED);
  }

  if (!content || !content.trim()) {
    throw new Error(MESSAGES.CONTENT_REQUIRED);
  }

  const users =
    await notificationRepository.findAllUserIds();

  await Promise.allSettled(
    users.map(user =>
      notificationService.createNotification({
        userId: user.id,
        title,
        content,
        type,
        data
      })
    )
  );
},

  notifyAdmins: async ({
  title,
  content,
  type,
  data = {}
}) => {
  if (!title || !title.trim()) {
    throw new Error(MESSAGES.TITLE_REQUIRED);
  }

  if (!content || !content.trim()) {
    throw new Error(MESSAGES.CONTENT_REQUIRED);
  }

  const admins =
    await notificationRepository.findAdminUsers();

  await Promise.allSettled(
    admins.map(admin =>
      notificationService.createNotification({
        userId: admin.id,
        title,
        content,
        type,
        data
      })
    )
  );
},
};

module.exports = notificationService;