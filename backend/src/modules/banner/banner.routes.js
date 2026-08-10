const express = require('express');
const router = express.Router();

const bannerController = require('./banner.controller');
const bannerValidation = require('./banner.validation');
const uploadMiddleware = require('../../middlewares/upload.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

const { uploadBannerImage } = require('../../config/cloudinary');

router.get(
  '/active',
  bannerController.getActive
);

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));


router.post(
  '/',
  uploadMiddleware.single(uploadBannerImage, 'image'),
  bannerValidation.validateCreate,
  bannerController.create
);


router.get(
  '/',
  bannerController.getAll
);


router.put(
  '/:id',
  uploadMiddleware.single(uploadBannerImage, 'image'),
  bannerValidation.validateUpdate,
  bannerController.update
);


router.delete(
  '/:id',
  bannerController.delete
);


module.exports = router;