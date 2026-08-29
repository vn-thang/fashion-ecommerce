const redisClient = require('../../config/redis');

const redisCache = {
  async get(key) {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  },

  async set(key, value, ttlSeconds = 300) {
    await redisClient.set(
      key,
      JSON.stringify(value),
      {
        EX: ttlSeconds
      }
    );
  },

  async delete(key) {
    await redisClient.del(key);
  }
};

module.exports = redisCache;