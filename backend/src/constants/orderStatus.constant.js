const ORDER_STATUS = {
  PENDING: 'PENDING',       // Chờ xác nhận
  PROCESSING: 'PROCESSING', // Đang xử lý
  SHIPPING: 'SHIPPING',     // Đang giao hàng
  COMPLETED: 'COMPLETED',   // Đã giao
  CANCELLED: 'CANCELLED',   // Đã hủy
  RETURN: 'RETURN'          // Hoàn lại
};

module.exports = { ORDER_STATUS };