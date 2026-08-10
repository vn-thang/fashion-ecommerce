const express = require('express');
const router = express.Router();

const productAdminController = require('./product.admin.controller');
const productValidation = require('../product.validation');

const uploadMiddleware = require('../../../middlewares/upload.middleware');
const { uploadProductImage } = require('../../../config/cloudinary');

const authenticate = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');

const adminGuard = [
  authenticate,
  authorize('ADMIN')
];

router.post(
  '/',
  adminGuard,
  uploadMiddleware.single(uploadProductImage, 'thumbnail'),
  productValidation.validateCreateProduct,
  productAdminController.createProduct
);

router.get(
  '/',
  adminGuard,
  productAdminController.getAll
);

router.get(
  '/:id',
  adminGuard,
  productValidation.validateId,
  productAdminController.getById
);

router.put(
  '/:id',
  adminGuard,
  uploadMiddleware.single(uploadProductImage, 'thumbnail'),
  productValidation.validateUpdateProduct,
  productAdminController.updateProduct
);

router.delete(
  '/:id',
  adminGuard,
  productValidation.validateId,
  productAdminController.deleteProduct
);

router.post(
  '/:productId/images',
  adminGuard,
  uploadMiddleware.array(uploadProductImage, 'images', 8),
  productValidation.validateUploadAlbum,
  productAdminController.uploadAlbum
);

router.delete(
  '/:productId/images/:imageId',
  adminGuard,
  productValidation.validateImageParams,
  productAdminController.deleteImage
);

router.post(
  '/:productId/variants',
  adminGuard,
  productValidation.validateCreateVariant,
  productAdminController.createVariant
);

router.put(
  '/variants/:id',
  adminGuard,
  productValidation.validateId,
  productAdminController.updateVariant
);

router.delete(
  '/variants/:id',
  adminGuard,
  productValidation.validateId,
  productAdminController.deleteVariant
);

router.patch(
  '/variants/:id/activate',
  adminGuard,
  productValidation.validateId,
  productAdminController.activateVariant
);

module.exports = router;