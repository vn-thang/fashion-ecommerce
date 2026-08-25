
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (
  subFolder,
  options = {}
) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `fashion_ecommerce/${subFolder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        {
          width: 1000,
          height: 1000,
          crop: 'limit'
        }
      ],
      ...options
    }
  });

  return multer({ storage });
};

const uploadUserImage = createUploader('users');

const uploadBrandImage = createUploader('brands');

const uploadProductImage = createUploader('products');

const uploadStoreImage = createUploader('store');

const uploadBannerImage = createUploader('banners');

const uploadChatAttachment = createUploader('chat', {
  resource_type: 'auto',
  allowed_formats: [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx'
  ],
  transformation: undefined
});

module.exports = {
  uploadUserImage,
  uploadBrandImage,
  uploadProductImage,
  uploadStoreImage,
  uploadBannerImage,
  uploadChatAttachment,
  createUploader
};