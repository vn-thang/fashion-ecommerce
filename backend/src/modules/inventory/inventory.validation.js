const {
  INVENTORY_TYPE,
  INVENTORY_MESSAGES
} = require('./inventory.constants');

const inventoryValidation = {
  validateImport(req, res, next) {
    const {
      productVariantId,
      quantity
    } = req.body;

    if (!productVariantId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu sản phẩm.'
      });
    }

    if (
      !quantity ||
      isNaN(quantity) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          INVENTORY_MESSAGES.INVALID_QUANTITY
      });
    }

    next();
  },

  validateAdjustment(req, res, next) {
    const {
      productVariantId,
      quantity,
      note
    } = req.body;

    if (!productVariantId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu sản phẩm.'
      });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      isNaN(quantity)
    ) {
      return res.status(400).json({
        success: false,
        message:
          INVENTORY_MESSAGES.INVALID_QUANTITY
      });
    }

    if (
      note === undefined ||
      note.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message:
          INVENTORY_MESSAGES.NOTE_REQUIRED
      });
    }

    next();
  }
};

module.exports = inventoryValidation;