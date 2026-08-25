const conversationService = require('./conversation.service');
const { sendSuccess, sendError } = require('../../utils/response');

const conversationController = {
  getOrCreate: async (req, res) => {
    try {
      const result = await conversationService.getOrCreateConversation(
        req.user.userId
      );

      return sendSuccess(
        res,
        200,
        'Lấy cuộc trò chuyện thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const result = await conversationService.getConversationById({
        conversationId: req.params.id,
        userId: req.user.userId,
        role: req.user.role
      });

      return sendSuccess(
        res,
        200,
        'Lấy cuộc trò chuyện thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  markAsRead: async (req, res) => {
    try {
      const result = await conversationService.markAsRead({
        conversationId: req.params.id,
        userId: req.user.userId
      });

      return sendSuccess(
        res,
        200,
        'Đánh dấu đã đọc thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  close: async (req, res) => {
    try {
      const result = await conversationService.closeConversation({
        conversationId: req.params.id,
        userId: req.user.userId,
        role: req.user.role
      });

      return sendSuccess(
        res,
        200,
        'Đóng cuộc trò chuyện thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = conversationController;