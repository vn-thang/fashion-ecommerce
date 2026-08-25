const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../config/redis');

const createRateLimiter = ({ windowMs, limit, message }) => {
  return rateLimit({
    windowMs,
    limit,

    standardHeaders: 'draft-7',
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args)
    }),

    message: {
      success: false,
      message
    }
  });
};

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.'
});

const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Bạn đã đăng ký quá nhiều lần. Vui lòng thử lại sau.'
});

const forgotPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Bạn đã yêu cầu đặt lại mật khẩu quá nhiều lần. Vui lòng thử lại sau.'
});

const resetPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Quá nhiều lần thử đặt lại mật khẩu. Vui lòng thử lại sau.'
});

const refreshRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: 'Quá nhiều lần yêu cầu làm mới phiên đăng nhập. Vui lòng thử lại sau.'
});

const createOrderRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  message: 'Bạn tạo đơn hàng quá nhanh. Vui lòng thử lại sau.'
});

module.exports = {
  loginRateLimiter,
  registerRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
  refreshRateLimiter,
  createOrderRateLimiter
};