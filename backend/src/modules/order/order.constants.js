const { ORDER_STATUS } = require('../../constants/orderStatus.constant');

const ORDER_CANCELLED_BY = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM'
};

const ORDER_MESSAGES = {
  INVALID_ID: 'ID không hợp lệ',

  CART_EMPTY: 'Giỏ hàng trống hoặc không tìm thấy sản phẩm được chọn',

  PROVINCE_REQUIRED: 'Vui lòng nhập Tỉnh/Thành phố nhận hàng',

  ADDRESS_REQUIRED: 'Vui lòng điền đầy đủ thông tin giao hàng',

  COUPON_INVALID:
    'Mã giảm giá không tồn tại, chưa kích hoạt hoặc đã hết hạn',

  COUPON_MIN_NOT_MET:
    'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá',

  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',

  CREATE_SUCCESS: 'Tạo đơn hàng thành công',

  PREVIEW_SUCCESS: 'Tính toán chi phí thành công',

  CANCEL_SUCCESS: 'Hủy đơn hàng thành công',

  ORDER_ALREADY_CANCELLED: 'Đơn hàng đã được hủy.',

  ORDER_CANNOT_CANCEL:
    'Đơn hàng hiện tại không thể hủy.',

  ORDER_NOT_OWNER:
    'Bạn không có quyền thao tác với đơn hàng này.'
};

module.exports = {
  ORDER_MESSAGES,
  ORDER_STATUS,
  ORDER_CANCELLED_BY
};