const express = require('express');

const router = express.Router();

const chatAdminController = require('./chatAdmin.controller');

const chatValidation = require('../chat.validation');

const authMiddleware = require('../../../middlewares/auth.middleware');

const roleMiddleware = require('../../../middlewares/role.middleware');

const chatUploadRoutes = require('../chatUpload.routes');

router.use(authMiddleware);

router.use(roleMiddleware('ADMIN'));

router.get(
  '/',
  chatAdminController.getAllConversations
);

router.get(
  '/:id',
  chatValidation.validateConversationId,
  chatAdminController.getConversation
);

router.get(
  '/:id/messages',
  chatValidation.validateConversationId,
  chatAdminController.getMessages
);

router.post(
  '/:id/messages',
  chatValidation.validateConversationId,
  chatValidation.validateCreateMessage,
  chatAdminController.sendMessage
);

router.patch(
  '/:id/read',
  chatValidation.validateConversationId,
  chatAdminController.markAsRead
);

router.patch(
  '/:id/close',
  chatValidation.validateConversationId,
  chatAdminController.close
);

router.use('/upload', chatUploadRoutes);

module.exports = router;