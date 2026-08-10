const { ORDER_MESSAGES } = require('./order.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const orderValidation = {
  validatePreview: (req, res, next) => {
    const { cartItemIds, buyNowItems, province } = req.body;
    
    const hasCartItems = Array.isArray(cartItemIds) && cartItemIds.length > 0;
    const hasBuyNowItems = Array.isArray(buyNowItems) && buyNowItems.length > 0;

    if (!hasCartItems && !hasBuyNowItems) {
      return res.status(400).json({ 
        success: false, 
        message: ORDER_MESSAGES.CART_EMPTY || 'Không tìm thấy sản phẩm nào để tiến hành thanh toán!' 
      });
    }

    if (!province || typeof province !== 'string' || province.trim() === '') {
      return res.status(400).json({ success: false, message: ORDER_MESSAGES.PROVINCE_REQUIRED });
    }
    
    next();
  },

  validateCreateOrder: (req, res, next) => {
    const { 
      cartItemIds, buyNowItems, receiverName, phoneNumber, 
      province, ward, addressLine, paymentMethod 
    } = req.body;
    
    const hasCartItems = Array.isArray(cartItemIds) && cartItemIds.length > 0;
    const hasBuyNowItems = Array.isArray(buyNowItems) && buyNowItems.length > 0;

    if (!hasCartItems && !hasBuyNowItems) {
      return res.status(400).json({ 
        success: false, 
        message: ORDER_MESSAGES.CART_EMPTY || 'Không tìm thấy sản phẩm nào để tiến hành thanh toán!' 
      });
    }
    
    if (!receiverName || !phoneNumber || !province || !ward || !addressLine) {
      return res.status(400).json({ success: false, message: ORDER_MESSAGES.ADDRESS_REQUIRED });
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn phương thức thanh toán hợp lệ' });
    }
    
    next();
  },

  validateOrderId: (req, res, next) => {
    const { id } = req.params;
    if (!validateUUID(id)) {
      return res.status(400).json({ success: false, message: ORDER_MESSAGES.INVALID_ID });
    }
    next();
  },

  validateCancelOrder: (req, res, next) => {
  const { id } = req.params;
  const { cancelReason } = req.body;

  if (!validateUUID(id)) {
    return res.status(400).json({
      success: false,
      message: ORDER_MESSAGES.INVALID_ID
    });
  }

  if (
    cancelReason !== undefined &&
    (
      typeof cancelReason !== 'string' ||
      cancelReason.trim().length === 0 ||
      cancelReason.trim().length > 500
    )
  ) {
    return res.status(400).json({
      success: false,
      message: 'Lý do hủy đơn không hợp lệ.'
    });
  }

  next();
},
};

module.exports = orderValidation;