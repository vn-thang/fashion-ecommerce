const AUDIT_LOG_CONSTANTS = {
  ACTIONS: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    ACTIVATE: 'ACTIVATE',
    DEACTIVATE: 'DEACTIVATE',
    CANCEL: 'CANCEL',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
  },

  ENTITY_NAMES: {
    USER: 'User',
    PRODUCT: 'Product',
    PRODUCT_VARIANT: 'ProductVariant',
    BRAND: 'Brand',
    CATEGORY: 'Category',
    ORDER: 'Order',
    PAYMENT: 'Payment',
    COUPON: 'Coupon',
    REVIEW: 'Review',
    FLASH_SALE: 'FlashSale',
    FLASH_SALE_VARIANT: 'FlashSaleVariant'
  },

  MESSAGES: {
    NOT_FOUND: 'Không tìm thấy audit log!',
    INVALID_ID: 'Mã audit log không hợp lệ!'
  }
};

module.exports = AUDIT_LOG_CONSTANTS;