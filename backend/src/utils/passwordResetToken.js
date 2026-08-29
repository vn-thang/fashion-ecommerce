const crypto = require('crypto');

const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return {
    token,
    tokenHash
  };
};

const generatePasswordResetToken = () => {
  return generateToken();
};

const generateEmailVerificationToken = () => {
  return generateToken();
};

module.exports = {
  generatePasswordResetToken,
  generateEmailVerificationToken
};