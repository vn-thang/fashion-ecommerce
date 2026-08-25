const messageService = require('./message.service');

const {
  sendSuccess,
  sendError
} = require('../../utils/response');

const messageController = {
  create: async (req, res) => {
    try {
      const result =
        await messageService.sendMessage({
          conversationId: req.params.id,
          senderId: req.user.userId,
          type: req.body.type,
          content: req.body.content,
          attachmentUrl:
            req.body.attachmentUrl,
          attachmentName:
            req.body.attachmentName
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

  getAll: async (req, res) => {
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
  markAsDelivered: async (req, res) => {
  try {
    const result =
      await messageService.markAsDelivered({
        messageId: req.params.messageId,
        userId: req.user.userId,
        role: req.user.role
      });

    return sendSuccess(
      res,
      200,
      'Đã nhận tin nhắn thành công!',
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

module.exports = messageController;