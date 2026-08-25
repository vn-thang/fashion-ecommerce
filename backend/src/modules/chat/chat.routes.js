const express = require('express');

const router = express.Router();

const conversationController = require('./conversation.controller');
const messageController = require('./message.controller');
const chatValidation = require('./chat.validation');
const authMiddleware = require('../../middlewares/auth.middleware');
const chatUploadRoutes = require('./chatUpload.routes');

router.use(authMiddleware);

router.get('/me', conversationController.getOrCreate);

router.get(
  '/:id',
  chatValidation.validateConversationId,
  conversationController.getById
);

router.get(
  '/:id/messages',
  chatValidation.validateConversationId,
  messageController.getAll
);

router.post(
  '/:id/messages',
  chatValidation.validateConversationId,
  chatValidation.validateCreateMessage,
  messageController.create
);

router.patch(
  '/:id/read',
  chatValidation.validateConversationId,
  conversationController.markAsRead
);

router.patch(
  '/:id/close',
  chatValidation.validateConversationId,
  conversationController.close
);

router.use('/upload', chatUploadRoutes);

module.exports = router;