const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const createUploader = (subFolder, options = {}) => {
  const {
    transformation,
    allowed_formats = ['jpg', 'jpeg', 'png', 'webp'],
    resource_type = 'image',
    ...cloudinaryOptions
  } = options;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `fashion_ecommerce/${subFolder}`,

      resource_type,

      allowed_formats,
      ...(transformation ? { transformation } : {}),

      ...cloudinaryOptions
    }
  });

  return multer({
    storage,
    limits: {
      fileSize: MAX_FILE_SIZE
    }
  });
};

const uploadUserImage = createUploader('users', {
  transformation: [
    {
      width: 500,
      height: 500,
      crop: 'limit'
    }
  ]
});

const uploadBrandImage = createUploader('brands', {
  transformation: [
    {
      width: 500,
      height: 500,
      crop: 'limit'
    }
  ]
});

const uploadProductImage = createUploader('products', {
  transformation: [
    {
      width: 2400,
      height: 2400,
      crop: 'limit'
    }
  ]
});

const uploadStoreImage = createUploader('store', {
  transformation: [
    {
      width: 1200,
      height: 1200,
      crop: 'limit'
    }
  ]
});

const uploadBannerImage = createUploader('banners', {
  transformation: [
    {
       width: 1600,
      height: 600,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    }
  ]
});

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
  ]
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