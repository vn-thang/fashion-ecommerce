const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const notificationValidation = require('./notification.validation');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post(
  '/device-token',
  notificationController.registerDeviceToken
);

router.delete(
  '/device-token',
  notificationController.removeDeviceToken
);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read',
  notificationValidation.validateId,
  notificationController.markAsRead
);

module.exports = router;