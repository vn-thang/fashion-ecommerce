const conversationService = require('../conversation.service');
const messageService = require('../message.service');

const {
  sendSuccess,
  sendError
} = require('../../../utils/response');

const chatAdminController = {
getAllConversations: async (req, res) => {
  try {
    const result =
      await conversationService.getAdminConversations({
        ...req.query,
        adminId: req.user.userId
      });

    return sendSuccess(
      res,
      200,
      'Lấy danh sách cuộc trò chuyện thành công!',
      result
    );
  } catch (err) {
    return sendError(
      res,
      500,
      err.message
    );
  }
},

  getConversation: async (req, res) => {
    try {
      const result =
        await conversationService.getConversationById({
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
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  getMessages: async (req, res) => {
    try {
      const result =
        await messageService.getMessages({
          conversationId: req.params.id,
          userId: req.user.userId,
          role: req.user.role,
          queryParams: req.query
        });

      return sendSuccess(
        res,
        200,
        'Lấy danh sách tin nhắn thành công!',
        result
      );
    } catch (err) {
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  sendMessage: async (req, res) => {
    try {
      const result =
        await messageService.sendMessage({
          conversationId: req.params.id,
          senderId: req.user.userId,
          role: req.user.role,
          type: req.body.type,
          content: req.body.content,
          attachmentUrl: req.body.attachmentUrl,
          attachmentName: req.body.attachmentName
        });

      return sendSuccess(
        res,
        201,
        'Gửi tin nhắn thành công!',
        result
      );
    } catch (err) {
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  markAsRead: async (req, res) => {
    try {
      const result =
        await conversationService.markAsRead({
          conversationId: req.params.id,
          userId: req.user.userId,
          role: req.user.role
        });

      return sendSuccess(
        res,
        200,
        'Đánh dấu đã đọc thành công!',
        result
      );
    } catch (err) {
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  close: async (req, res) => {
    try {
      const result =
        await conversationService.closeConversation({
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
      return sendError(
        res,
        400,
        err.message
      );
    }
  }
};

module.exports = chatAdminController;