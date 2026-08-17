const notificationService = require('./notification.service');
const { MESSAGES } = require('./notification.constants');
const { sendSuccess, sendError } = require('../../utils/response');

const notificationController = {
  getMyNotifications: async (req, res) => {
    try {
      const result = await notificationService.getMyNotifications(
        req.user.userId,
        req.query
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.GET_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const unreadCount = await notificationService.getUnreadCount(
        req.user.userId
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.GET_UNREAD_SUCCESS,
        { unreadCount }
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  markAsRead: async (req, res) => {
    try {
      const result = await notificationService.markAsRead(
        req.params.id,
        req.user.userId
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.MARK_READ_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      const result = await notificationService.markAllAsRead(
        req.user.userId
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.MARK_ALL_READ_SUCCESS,
        {
          updatedCount: result.count
        }
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },
  registerDeviceToken: async (req, res) => {
  try {
    const result = await notificationService.registerDeviceToken({
      userId: req.user.userId,
      token: req.body.token,
      deviceType: req.body.deviceType
    });

    return sendSuccess(
      res,
      200,
      'Đăng ký thiết bị nhận thông báo thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},

removeDeviceToken: async (req, res) => {
    try {
      await notificationService.removeDeviceToken({
        userId: req.user.userId,
        token: req.body.token
      });

      return sendSuccess(
        res,
        200,
        'Xóa thiết bị nhận thông báo thành công!'
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },
};

module.exports = notificationController;