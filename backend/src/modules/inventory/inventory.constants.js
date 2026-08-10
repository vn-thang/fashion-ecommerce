const INVENTORY_TYPE = {
  IMPORT: 'Import',
  ADJUSTMENT: 'Adjustment',
  EXPORT: 'Export'
};

const INVENTORY_MESSAGES = {
  PRODUCT_VARIANT_NOT_FOUND:
    'Không tìm thấy phiên bản sản phẩm.',
  TRANSACTION_NOT_FOUND:
    'Không tìm thấy giao dịch kho.',

  IMPORT_SUCCESS:
    'Nhập kho thành công.',
  ADJUST_SUCCESS:
    'Điều chỉnh tồn kho thành công.',

  INVALID_QUANTITY:
    'Số lượng phải lớn hơn 0.',

  INVALID_TYPE:
    'Loại giao dịch không hợp lệ.',

  NOTE_REQUIRED:
    'Vui lòng nhập ghi chú.',

  STOCK_NOT_ENOUGH:
    'Số lượng tồn kho không đủ để điều chỉnh.'
};

module.exports = {
  INVENTORY_TYPE,
  INVENTORY_MESSAGES
};