const { MESSAGES } = require('./product.constants');

const validateUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

const productValidation = {
  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) return res.status(400).json({ success: false, message: MESSAGES.INVALID_UUID });
    next();
  },

  validateCreateProduct: (req, res, next) => {
    const { name, categoryId, brandId } = req.body;
    if (!name || name.trim() === '') return res.status(400).json({ success: false, message: MESSAGES.NAME_REQUIRED });
    if (!categoryId || !validateUUID(categoryId)) return res.status(400).json({ success: false, message: MESSAGES.CATEGORY_REQUIRED });
    if (!brandId || !validateUUID(brandId)) return res.status(400).json({ success: false, message: MESSAGES.BRAND_REQUIRED });
    if (!req.file) return res.status(400).json({ success: false, message: MESSAGES.THUMBNAIL_REQUIRED });
    next();
  },

  validateUploadAlbum: (req, res, next) => {
    if (!validateUUID(req.params.productId)) return res.status(400).json({ success: false, message: MESSAGES.INVALID_UUID });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: MESSAGES.ALBUM_REQUIRED });
    next();
  },

  validateCreateVariant: (req, res, next) => {
    const { productId } = req.params;
    const { sku, price, stockQuantity } = req.body;
    if (!validateUUID(productId)) return res.status(400).json({ success: false, message: MESSAGES.INVALID_UUID });
    if (!sku || sku.trim() === '') return res.status(400).json({ success: false, message: MESSAGES.SKU_REQUIRED });
    if (!price || parseFloat(price) <= 0 || isNaN(price)) return res.status(400).json({ success: false, message: MESSAGES.PRICE_INVALID });
    if (stockQuantity === undefined || parseInt(stockQuantity) < 0 || isNaN(stockQuantity)) return res.status(400).json({ success: false, message: MESSAGES.STOCK_INVALID });
    next();
  },

  validateUpdateProduct: (req, res, next) => {
    if (!validateUUID(req.params.id)) return res.status(400).json({ success: false, message: MESSAGES.INVALID_UUID });
    next();
  },
  validateImageParams: (req, res, next) => {
  const { productId, imageId } = req.params;

  if (!validateUUID(productId) || !validateUUID(imageId)) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.INVALID_UUID
    });
  }

  next();
},
validateDeleteImage: (req, res, next) => {
  const { productId, imageId } = req.params;

  if (!validateUUID(productId) || !validateUUID(imageId)) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.INVALID_UUID
    });
  }

  next();
}
};

module.exports = productValidation;