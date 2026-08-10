const { MESSAGES } = require('./storeSetting.constants');

const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const storeSettingValidation = {

  validateUpdate: (req, res, next) => {

    const {
      storeName,
      hotline,
      zalo,
      email
    } = req.body;

    if (
      storeName !== undefined &&
      storeName.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.STORE_NAME_REQUIRED
      });
    }

    if (
      hotline &&
      !phoneRegex.test(hotline)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.HOTLINE_INVALID
      });
    }

    if (
      zalo &&
      !phoneRegex.test(zalo)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.ZALO_INVALID
      });
    }

    if (
      email &&
      !emailRegex.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMAIL_INVALID
      });
    }

    next();
  }

};

module.exports = storeSettingValidation;