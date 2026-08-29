const express = require('express');

const router = express.Router();

const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const authMiddleware = require('../../middlewares/auth.middleware');

const {
  loginRateLimiter,
  registerRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
  resendVerificationRateLimiter
} = require('../../middlewares/rateLimit.middleware');

router.post(
  '/register',
  registerRateLimiter,
  authValidation.validateRegister,
  authController.register
);

router.get(
  '/verify-email',
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  resendVerificationRateLimiter,
  authController.resendVerificationEmail
);

router.post(
  '/login',
  loginRateLimiter,
  authValidation.validateLogin,
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  forgotPasswordRateLimiter,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordRateLimiter,
  authController.resetPassword
);

router.put(
  '/change-password',
  authMiddleware,
  authController.changePassword
);

module.exports = router;