const { MESSAGES } = require('./coupon.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const couponValidation = {
  validateCreate: (req, res, next) => {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ success: false, message: MESSAGES.CODE_REQUIRED });
    }

    if (!['PERCENTAGE', 'FIXED'].includes(discountType)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_DISCOUNT_TYPE });
    }

    if (discountValue < 0 || minOrderAmount < 0 || maxDiscountAmount < 0 || usageLimit <= 0) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_VALUES });
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ success: false, message: 'Định dạng ngày không hợp lệ!' });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate } = req.body;

    if (!validateUUID(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_ID });
    }

    if (code !== undefined && code.trim() === '') {
      return res.status(400).json({ success: false, message: MESSAGES.CODE_REQUIRED });
    }

    if (discountType !== undefined && !['PERCENTAGE', 'FIXED'].includes(discountType)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_DISCOUNT_TYPE });
    }

    if ((discountValue !== undefined && discountValue < 0) || 
        (minOrderAmount !== undefined && minOrderAmount < 0) || 
        (maxDiscountAmount !== undefined && maxDiscountAmount < 0) || 
        (usageLimit !== undefined && usageLimit <= 0)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_VALUES });
    }

    if ((startDate !== undefined && !isValidDate(startDate)) || (endDate !== undefined && !isValidDate(endDate))) {
      return res.status(400).json({ success: false, message: 'Định dạng ngày không hợp lệ!' });
    }

    next();
  },

  validateParamsId: (req, res, next) => {
    const { id } = req.params;
    if (!validateUUID(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_ID });
    }
    next();
  }
};

module.exports = couponValidation;