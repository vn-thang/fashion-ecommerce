const crypto = require('crypto');
const querystring = require('querystring');
const paymentConfig = require('./payment.config');

const sortObject = (obj) => {
  const sorted = {};

  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });

  return sorted;
};

const createSecureHash = (params) => {
  const sortedParams = sortObject(params);

const signData = querystring.stringify(sortedParams);

  return crypto
    .createHmac('sha512', paymentConfig.hashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
};

const buildPaymentUrl = (params) => {
  const sortedParams = sortObject(params);

  const secureHash = createSecureHash(sortedParams);

  sortedParams.vnp_SecureHash = secureHash;

return paymentConfig.vnpUrl + '?' + querystring.stringify(sortedParams);
};

const verifySecureHash = (query) => {
  const params = { ...query };

  const receivedHash = params.vnp_SecureHash;

  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const generatedHash = createSecureHash(params);

  return generatedHash === receivedHash;
};

const createDate = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, '0');

  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

const createExpireDate = () => {
  const expire = new Date();

  expire.setMinutes(expire.getMinutes() + 15);

  return createDate(expire);
};

const generateTxnRef = () => {
  return Date.now().toString();
};

module.exports = {
  sortObject,
  createSecureHash,
  buildPaymentUrl,
  verifySecureHash,
  createDate,
  createExpireDate,
  generateTxnRef
};