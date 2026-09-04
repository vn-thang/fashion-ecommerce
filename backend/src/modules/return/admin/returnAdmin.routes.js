const express = require('express');

const router = express.Router();

const returnAdminController =
  require('./returnAdmin.controller');

const returnValidation =
  require('../return.validation');

const authMiddleware =
  require('../../../middlewares/auth.middleware');

const roleMiddleware =
  require('../../../middlewares/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.get(
  '/',
  returnAdminController.getAll
);

router.get(
  '/:id',
  returnValidation.validateId,
  returnAdminController.getById
);

router.patch(
  '/:id/approve',
  returnValidation.validateId,
  returnAdminController.approve
);

router.patch(
  '/:id/reject',
  returnValidation.validateId,
  returnValidation.validateReject,
  returnAdminController.reject
);

router.patch(
  '/:id/received',
  returnValidation.validateId,
  returnAdminController.received
);

router.patch(
  '/:id/complete',
  returnValidation.validateId,
  returnAdminController.complete
);

module.exports = router;