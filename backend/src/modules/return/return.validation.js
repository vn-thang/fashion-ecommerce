const { MESSAGES, REASONS } = require('./return.constants');

const validateUUID = id => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const returnValidation = {
  validateCreate: (req, res, next) => {
    const { orderId, reason, description, items } = req.body;

    if (!validateUUID(orderId)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_ID
      });
    }

    if (
      typeof reason !== 'string' ||
      reason.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.REASON_REQUIRED
      });
    }

    if (!Object.values(REASONS).includes(reason)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.REASON_INVALID
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.DESCRIPTION_INVALID
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.RETURN_REQUIRED
      });
    }

    for (const item of items) {
      if (
        !validateUUID(item.orderItemId) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.RETURN_QUANTITY_INVALID
        });
      }
    }

    next();
  },

  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_ID
      });
    }

    next();
  },

  validateReject: (req, res, next) => {
    const { rejectReason } = req.body;

    if (
      typeof rejectReason !== 'string' ||
      rejectReason.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.REJECT_REASON_REQUIRED
      });
    }

    next();
  }
};

module.exports = returnValidation;