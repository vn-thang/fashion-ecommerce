const { MESSAGES } = require('./user.constants');

const validateUUID = id => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(id);
};

const userValidation = {
  validateUpdateProfile: (req, res, next) => {
    const { phoneNumber } = req.body;

    if (phoneNumber && !/^[0-9]{9,11}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ!'
      });
    }

    next();
  },

  validateAddressInput: (req, res, next) => {
    const {
      receiverName,
      phoneNumber,
      province,
      ward,
      addressLine
    } = req.body;

    if (
      !receiverName ||
      !phoneNumber ||
      !province ||
      !ward ||
      !addressLine
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.REQUIRED_FIELDS
      });
    }

    if (!/^[0-9]{9,11}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại nhận hàng không hợp lệ!'
      });
    }

    next();
  },

  validateAddressId: (req, res, next) => {
    const { addressId } = req.params;

    if (!validateUUID(addressId)) {
      return res.status(400).json({
        success: false,
        message: 'AddressId ' + MESSAGES.INVALID_ID
      });
    }

    next();
  },

  validateUserId: (req, res, next) => {
    const { userId } = req.params;

    if (!validateUUID(userId)) {
      return res.status(400).json({
        success: false,
        message: 'UserId ' + MESSAGES.INVALID_ID
      });
    }

    next();
  },

  validateUserStatus: (req, res, next) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: MESSAGES.INVALID_USER_STATUS
    });
  }

  next();
}
};

module.exports = userValidation;