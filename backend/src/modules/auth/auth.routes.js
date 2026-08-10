
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post('/register', authValidation.validateRegister, authController.register);
router.post('/login', authValidation.validateLogin, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.post(
  '/change-password',
  authMiddleware,
  authController.changePassword
);
module.exports = router;