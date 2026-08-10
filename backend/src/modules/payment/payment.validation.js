const { PAYMENT_MESSAGES } = require('./payment.constants');

const PAYMENT_METHOD = {
  COD: 'COD',
  VNPAY: 'VNPAY'
};

const validateUUID = (id) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regex.test(id);
};

const validateCallback = (req, res, next) => {
  const {
    vnp_TxnRef,
    vnp_Amount,
    vnp_ResponseCode,
    vnp_SecureHash
  } = req.query;

  if (
    !vnp_TxnRef ||
    !vnp_Amount ||
    !vnp_ResponseCode ||
    !vnp_SecureHash
  ) {
    return res.status(400).json({
      success: false,
      message: PAYMENT_MESSAGES.INVALID_RESPONSE
    });
  }

  next();
};

const paymentValidation = {
  validateCreatePayment(req, res, next) {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !validateUUID(orderId)) {
      return res.status(400).json({
        success: false,
        message: PAYMENT_MESSAGES.INVALID_ORDER
      });
    }

    if (
      paymentMethod &&
      !Object.values(PAYMENT_METHOD).includes(
        paymentMethod.toUpperCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: PAYMENT_MESSAGES.INVALID_PAYMENT_METHOD
      });
    }

    next();
  },

  validatePaymentId(req, res, next) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        message: PAYMENT_MESSAGES.PAYMENT_NOT_FOUND
      });
    }

    next();
  },

  validateReturn: validateCallback,

  validateIpn: validateCallback
};

module.exports = paymentValidation;