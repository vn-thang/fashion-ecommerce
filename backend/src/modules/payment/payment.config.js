require('dotenv').config();

const paymentConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE,

  hashSecret: process.env.VNPAY_HASH_SECRET,

  vnpUrl: process.env.VNPAY_URL,

  returnUrl: process.env.VNPAY_RETURN_URL,

  ipnUrl: process.env.VNPAY_IPN_URL,

  apiUrl: process.env.VNPAY_API,

  version: process.env.VNPAY_VERSION || '2.1.0',

  command: process.env.VNPAY_COMMAND || 'pay',

  currency: process.env.VNPAY_CURRENCY || 'VND',

  locale: process.env.VNPAY_LOCALE || 'vn',

  orderType: process.env.VNPAY_ORDER_TYPE || 'fashion'
};

module.exports = paymentConfig;