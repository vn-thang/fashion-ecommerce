const { MESSAGES } = require('./flashSaleVariant.constant');

const validateUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(id);
};

const flashSaleVariantValidation = {
 
  validateCreate: (req, res, next) => {
   const { flashSaleId } = req.params;
  const { variants } = req.body;

    if (!flashSaleId || !validateUUID(flashSaleId)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.FLASH_SALE_REQUIRED
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.VARIANTS_REQUIRED
      });
    }

    for (const item of variants) {
      if (
        !item.productVariantId ||
        !validateUUID(item.productVariantId)
      ) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.PRODUCT_VARIANT_REQUIRED
        });
      }

      if (
        item.flashSalePrice === undefined ||
        isNaN(item.flashSalePrice) ||
        Number(item.flashSalePrice) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.FLASH_SALE_PRICE_INVALID
        });
      }

      if (
        item.flashSaleStock === undefined ||
        isNaN(item.flashSaleStock) ||
        parseInt(item.flashSaleStock) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.FLASH_SALE_STOCK_INVALID
        });
      }
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    const { flashSalePrice, flashSaleStock } = req.body;

    if (
      flashSalePrice !== undefined &&
      (isNaN(flashSalePrice) || Number(flashSalePrice) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.FLASH_SALE_PRICE_INVALID
      });
    }

    if (
      flashSaleStock !== undefined &&
      (isNaN(flashSaleStock) ||
        parseInt(flashSaleStock) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.FLASH_SALE_STOCK_INVALID
      });
    }

    next();
  },

  validateDelete: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    next();
  },

  validateFlashSaleId: (req, res, next) => {
    const { flashSaleId } = req.params;

    if (!validateUUID(flashSaleId)) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    next();
  },

  validateAvailable: (req, res, next) => {
    const { flashSaleId, categoryId, brandId } = req.query;

    if (
      flashSaleId &&
      !validateUUID(flashSaleId)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    if (
      categoryId &&
      !categoryId
        .split(',')
        .every(validateUUID)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    if (
      brandId &&
      !brandId
        .split(',')
        .every(validateUUID)
    ) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_UUID
      });
    }

    next();
  }, 

  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: MESSAGES.INVALID_UUID
        });
    }
    next();
},
};

module.exports = flashSaleVariantValidation;