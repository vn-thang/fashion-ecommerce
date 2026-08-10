const express = require('express');

const router = express.Router();

const adminUserController = require('../admin/adminUser.controller');
const userValidation = require('../user.validation');

const authenticate = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');

router.use(authenticate);
router.use(authorize('Admin'));

router.get(
  '/',
  adminUserController.getAllUsers
);

router.get(
  '/:userId',
  userValidation.validateUserId,
  adminUserController.getUserDetail
);

router.patch(
  '/:userId/status',
  userValidation.validateUserId,
  userValidation.validateUserStatus,
  adminUserController.updateUserStatus
);

module.exports = router;