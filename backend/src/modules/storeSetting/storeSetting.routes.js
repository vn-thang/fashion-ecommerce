const express = require('express');
const router = express.Router();

const storeSettingController = require('./storeSetting.controller');
const storeSettingValidation = require('./storeSetting.validation');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');
const { uploadStoreImage } = require('../../config/cloudinary');

router.get(
  '/',
  storeSettingController.get
);
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));
router.put(
  '/',
  uploadMiddleware.single(uploadStoreImage, 'logo'),
  storeSettingValidation.validateUpdate,
  storeSettingController.update
);

module.exports = router;