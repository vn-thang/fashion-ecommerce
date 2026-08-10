const { MESSAGES } = require('./flashSale.constants');

// Helper kiểm tra UUID
const validateUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(id);
};

const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return end > start;
};

const flashSaleValidation = {
  validateCreate: (req, res, next) => {
    const { name, startDate, endDate } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: MESSAGES.NAME_REQUIRED
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.START_DATE_REQUIRED
      });
    }

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.END_DATE_REQUIRED
      });
    }

    if (!validateDateRange(startDate, endDate)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATE
      });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;

    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_ID
      });
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: MESSAGES.NAME_REQUIRED
      });
    }

    if (
      startDate &&
      endDate &&
      !validateDateRange(startDate, endDate)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATE
      });
    }

    next();
  },

  validateDelete: (req, res, next) => {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_ID
      });
    }

    next();
  }
};

module.exports = flashSaleValidation;