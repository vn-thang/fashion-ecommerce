const { MESSAGES, MESSAGE_TYPE } = require('./chat.constants');

const validateUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(id);
};

const chatValidation = {
  validateConversationId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_CONVERSATION_ID
      });
    }

    next();
  },

  validateMessageId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_MESSAGE_ID
      });
    }

    next();
  },

  validateCreateMessage: (req, res, next) => {
    const {
      type = MESSAGE_TYPE.TEXT,
      content
    } = req.body;

    if (!Object.values(MESSAGE_TYPE).includes(type)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_MESSAGE_TYPE
      });
    }

    if (
      type === MESSAGE_TYPE.TEXT &&
      (typeof content !== 'string' || content.trim() === '')
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.CONTENT_REQUIRED
      });
    }

    next();
  }
};

module.exports = chatValidation;