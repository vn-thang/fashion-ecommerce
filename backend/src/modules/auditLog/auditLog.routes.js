const express = require('express');

const router = express.Router();

const auditLogController =
  require('./auditLog.controller');

const auditLogValidation =
  require('./auditLog.validation');

const authMiddleware =
  require('../../middlewares/auth.middleware');

const roleMiddleware =
  require('../../middlewares/role.middleware');

router.use(authMiddleware);

router.use(roleMiddleware('ADMIN'));

router.get(
  '/',
  auditLogController.getAll
);

router.get(
  '/:id',
  auditLogValidation.validateId,
  auditLogController.getById
);

module.exports = router;