const express = require('express');
const router = express.Router();

const categoryAdminController = require('./category.admin.controller');
const categoryValidation = require('../category.validation');

const authMiddleware = require('../../../middlewares/auth.middleware');
const roleMiddleware = require('../../../middlewares/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.post(
  '/',
  categoryValidation.validateCreate,
  categoryAdminController.create
);

router.get(
  '/',
  categoryAdminController.getAll
);

router.put(
  '/:id',
  categoryValidation.validateUpdate,
  categoryAdminController.update
);

router.patch(
  '/:id/deactivate',
  categoryValidation.validateId,
  categoryAdminController.deactivate
);

router.patch(
  '/:id/activate',
  categoryValidation.validateId,
  categoryAdminController.activate
);

module.exports = router;