const express = require('express');
const router = express.Router();
const brandAdminController = require('./brandAdmin.controller');
const brandValidation = require('../brand.validation');
const uploadMiddleware = require('../../../middlewares/upload.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware'); 
const roleMiddleware = require('../../../middlewares/role.middleware');
const { uploadBrandImage } = require('../../../config/cloudinary');

router.use(authMiddleware); 
router.use(roleMiddleware('ADMIN'));

router.post(
  '/',
  uploadMiddleware.single(uploadBrandImage, 'logo'),
  brandValidation.validateCreate,
  brandAdminController.create
);

router.get('/', brandAdminController.getAll);

router.put(
  '/:id',
  uploadMiddleware.single(uploadBrandImage, 'logo'),
  brandValidation.validateUpdate,
  brandAdminController.update
);

router.patch(
  '/:id/deactivate',
  brandValidation.validateId,
  brandAdminController.deactivate
);

router.patch(
  '/:id/activate',
  brandValidation.validateId,
  brandAdminController.activate
);

module.exports = router;