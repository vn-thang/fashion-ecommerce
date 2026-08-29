const redisClient = require('../../config/redis');

const RESET_TOKEN_TTL = 15 * 60; 

const getResetTokenKey = tokenHash =>
  `password-reset:${tokenHash}`;

const otpRedis = {
  setResetToken: async (
    tokenHash,
    userId,
    ttlSeconds = RESET_TOKEN_TTL
  ) => {
    const key = getResetTokenKey(tokenHash);

    const data = {
      userId,
      tokenHash
    };

    await redisClient.set(
      key,
      JSON.stringify(data),
      {
        EX: ttlSeconds
      }
    );
  },

  getResetToken: async tokenHash => {
    const key = getResetTokenKey(tokenHash);

    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  },

  deleteResetToken: async tokenHash => {
    const key = getResetTokenKey(tokenHash);

    await redisClient.del(key);
  }
};

module.exports = otpRedis;