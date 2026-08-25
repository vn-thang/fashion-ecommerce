const express = require('express');
const chatUploadController = require('./chatUpload.controller');
const uploadMiddleware = require('../../middlewares/upload.middleware');
const { uploadChatAttachment } = require('../../config/cloudinary');

const router = express.Router();

router.post(
  '/',
  uploadMiddleware.single(
    uploadChatAttachment,
    'file'
  ),
  chatUploadController.upload
);

module.exports = router;