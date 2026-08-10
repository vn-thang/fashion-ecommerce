const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const userValidation = require('./user.validation');

const authenticate = require('../../middlewares/auth.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');
const { uploadUserImage } = require('../../config/cloudinary'); 

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userValidation.validateUpdateProfile, userController.updateProfile);

router.post('/profile/avatar', 
  uploadMiddleware.single(uploadUserImage, 'avatar'), 
  userController.uploadAvatar
);

router.get('/addresses', userController.getAddresses);
router.post('/addresses', userValidation.validateAddressInput, userController.addAddress);
router.put('/addresses/:addressId', userValidation.validateAddressId, userValidation.validateAddressInput, userController.updateAddress);
router.delete('/addresses/:addressId', userValidation.validateAddressId, userController.deleteAddress);
router.patch('/addresses/:addressId/default', userValidation.validateAddressId, userController.setAddressDefault);

module.exports = router;