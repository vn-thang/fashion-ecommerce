const { messaging } = require('../../config/firebase');
const notificationRepository = require('./notification.repository');

const fcmService = {
  sendToToken: async ({ token, title, body, data = {} }) => {
    if (!token) {
      throw new Error('FCM token là bắt buộc!');
    }

    if (!title) {
      throw new Error('Tiêu đề thông báo là bắt buộc!');
    }

    const message = {
      token,
      data: {
        title: title.trim(),
        body: body || '',
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            String(value)
          ])
        )
      }
    };

    try {
      return await messaging.send(message);
    } catch (error) {
      if (
        error.code === 'messaging/registration-token-not-registered' ||
        error.code === 'messaging/invalid-registration-token'
      ) {
        await notificationRepository.removeDeviceToken({
          token
        });

        console.warn(
          `Removed invalid FCM token: ${token}`
        );
      }

      throw error;
    }
  }
};

module.exports = fcmService;