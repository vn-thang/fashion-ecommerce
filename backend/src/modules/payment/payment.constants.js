const {   PAYMENT_METHOD, PAYMENT_STATUS } = require('../../constants/paymentStatus.constant');

const VNPAY_RESPONSE_CODE = {
  SUCCESS: '00',
  USER_CANCEL: '24'
};

const PAYMENT_MESSAGES = {
  INVALID_PAYMENT_METHOD: 'Phương thức thanh toán không hợp lệ',
  INVALID_ORDER: 'Không tìm thấy đơn hàng',
  PAYMENT_NOT_FOUND: 'Không tìm thấy giao dịch thanh toán',

  CREATE_PAYMENT_URL_SUCCESS: 'Tạo liên kết thanh toán thành công',
  VERIFY_PAYMENT_SUCCESS: 'Xác minh thanh toán thành công',

  PAYMENT_SUCCESS: 'Thanh toán thành công',
  PAYMENT_FAILED: 'Thanh toán thất bại',
  PAYMENT_CANCELLED: 'Khách hàng đã hủy thanh toán',

  INVALID_SIGNATURE: 'Sai chữ ký bảo mật từ VNPAY',
  INVALID_RESPONSE: 'Dữ liệu trả về từ VNPAY không hợp lệ',
  INVALID_AMOUNT: 'Số tiền thanh toán không hợp lệ',

  ORDER_ALREADY_PAID: 'Đơn hàng đã được thanh toán',
  ORDER_INVALID_STATUS: 'Đơn hàng không ở trạng thái cho phép thanh toán.',

  GET_PAYMENTS_SUCCESS: 'Lấy danh sách giao dịch thành công',
  GET_PAYMENT_DETAIL_SUCCESS: 'Lấy chi tiết giao dịch thành công',

  REFUND_SUCCESS: 'Hoàn tiền thành công',
  REFUND_FAILED: 'Hoàn tiền thất bại',
  REFUND_INVALID_PAYMENT: 'Giao dịch không đủ điều kiện hoàn tiền'
};

module.exports = {
  PAYMENT_MESSAGES,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  VNPAY_RESPONSE_CODE
};