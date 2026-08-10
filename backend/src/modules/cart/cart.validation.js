const { MESSAGES } = require('./cart.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const cartValidation = {
  validateAddToCart: (req, res, next) => {
    const { productVariantId, quantity } = req.body;

    if (!productVariantId || !validateUUID(productVariantId)) {
      return res.status(400).json({ success: false, message: 'VariantId ' + MESSAGES.INVALID_ID });
    }

    if (quantity === undefined || isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_QUANTITY });
    }

    next();
  },

  validateUpdateItem: (req, res, next) => {
    const { itemId } = req.params; 
    const { quantity } = req.body;

    if (!validateUUID(itemId)) {
      return res.status(400).json({ success: false, message: 'ItemId ' + MESSAGES.INVALID_ID });
    }

    if (quantity === undefined || isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_QUANTITY });
    }

    next();
  },

  validateDeleteItem: (req, res, next) => {
    const { itemId } = req.params;
    if (!validateUUID(itemId)) {
      return res.status(400).json({ success: false, message: 'ItemId ' + MESSAGES.INVALID_ID });
    }
    next();
  }
};

module.exports = cartValidation;