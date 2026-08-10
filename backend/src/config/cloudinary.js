
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (subFolder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `fashion_ecommerce/${subFolder}`, 
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    },
  });

  return multer({ storage });
};

// Middleware up ảnh User (Avatar)
const uploadUserImage = createUploader('users');

// Middleware up ảnh Brand (Logo)
const uploadBrandImage = createUploader('brands');

// Middleware up ảnh Product 
const uploadProductImage = createUploader('products');

// Middleware up ảnh Store (Logo cửa hàng)
const uploadStoreImage = createUploader('store');

// Middleware up ảnh Banner
const uploadBannerImage = createUploader('banners');

module.exports = {
  uploadUserImage,
  uploadBrandImage,
  uploadProductImage,
  uploadStoreImage,
  uploadBannerImage,
  createUploader
};