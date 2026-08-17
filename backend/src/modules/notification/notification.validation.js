const { MESSAGES } = require('./notification.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const notificationValidation = {
  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_ID
      });
    }

    next();
  },
   validateDeviceToken: (req, res, next) => {
    const { token } = req.body;

    if (typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.TOKEN_REQUIRED
      });
    }

    next();
  }
};

module.exports = notificationValidation;