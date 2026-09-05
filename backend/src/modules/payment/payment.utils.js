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
  const vnDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh'
    })
  );

  const pad = n => String(n).padStart(2, '0');

  return (
    vnDate.getFullYear() +
    pad(vnDate.getMonth() + 1) +
    pad(vnDate.getDate()) +
    pad(vnDate.getHours()) +
    pad(vnDate.getMinutes()) +
    pad(vnDate.getSeconds())
  );
};

const createExpireDate = () => {
  const expire = new Date(
    Date.now() + 15 * 60 * 1000
  );

  return createDate(expire);
};

const generateTxnRef = () => {
  return Date.now().toString();
};

const createRefundSecureHash = ({
  vnp_RequestId,
  vnp_Version,
  vnp_Command,
  vnp_TmnCode,
  vnp_TransactionType,
  vnp_TxnRef,
  vnp_Amount,
  vnp_TransactionNo,
  vnp_TransactionDate,
  vnp_CreateBy,
  vnp_CreateDate,
  vnp_IpAddr,
  vnp_OrderInfo
}) => {
  const data = [
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_TransactionDate,
    vnp_CreateBy,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_OrderInfo
  ].join('|');

  return crypto
    .createHmac('sha512', paymentConfig.hashSecret)
    .update(Buffer.from(data, 'utf-8'))
    .digest('hex');
};

module.exports = {
  sortObject,
  createSecureHash,
  buildPaymentUrl,
  verifySecureHash,
  createDate,
  createExpireDate,
  generateTxnRef,
  createRefundSecureHash
};