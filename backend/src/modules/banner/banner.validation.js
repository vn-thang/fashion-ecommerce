const { MESSAGES } = require('./banner.constants');

const bannerValidation = {
  validateCreate: (req, res, next) => {
    const { title, displayOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.IMAGE_REQUIRED
      });
    }

    if (
      displayOrder !== undefined &&
      (isNaN(displayOrder) || Number(displayOrder) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Thứ tự hiển thị không hợp lệ.'
      });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { title, displayOrder } = req.body;

    if (
      displayOrder !== undefined &&
      (isNaN(displayOrder) || Number(displayOrder) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Thứ tự hiển thị không hợp lệ.'
      });
    }

    next();
  }
};

module.exports = bannerValidation;