const RETURN_CONSTANTS = {
  STATUS: {
    REQUESTED: 'REQUESTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SHIPPING: 'SHIPPING',
    RECEIVED: 'RECEIVED',
    COMPLETED: 'COMPLETED',
     CANCELLED: 'CANCELLED'
  },

  REASONS: {
    WRONG_SIZE: 'WRONG_SIZE',
    WRONG_PRODUCT: 'WRONG_PRODUCT',
    DEFECTIVE: 'DEFECTIVE',
    NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
    OTHER: 'OTHER'
  },

  MESSAGES: {
    INVALID_ID: 'Mã định danh không hợp lệ!',
    ORDER_NOT_FOUND: 'Đơn hàng không tồn tại!',
    ORDER_NOT_ELIGIBLE: 'Đơn hàng không đủ điều kiện để trả hàng!',
    RETURN_NOT_FOUND: 'Yêu cầu trả hàng không tồn tại!',
    RETURN_ALREADY_EXISTS: 'Sản phẩm đã có yêu cầu trả hàng đang được xử lý!',
    RETURN_ITEM_INVALID: 'Sản phẩm trả hàng không hợp lệ!',
    RETURN_QUANTITY_INVALID: 'Số lượng trả hàng không hợp lệ!',
    RETURN_REQUIRED: 'Vui lòng chọn ít nhất một sản phẩm để trả!',
    REASON_REQUIRED: 'Lý do trả hàng là bắt buộc!',
    REASON_INVALID: 'Lý do trả hàng không hợp lệ!',
    DESCRIPTION_INVALID: 'Mô tả trả hàng không hợp lệ!',
    RETURN_ALREADY_PROCESSED: 'Yêu cầu trả hàng đã được xử lý!',
    INVALID_STATUS: 'Trạng thái trả hàng không hợp lệ!',
    APPROVE_FAILED: 'Không thể duyệt yêu cầu trả hàng!',
    REJECT_REASON_REQUIRED: 'Lý do từ chối là bắt buộc!',
    RECEIVED_INVALID: 'Yêu cầu trả hàng chưa ở trạng thái cho phép xác nhận đã nhận!',
    REFUND_FAILED: 'Hoàn tiền thất bại!',
    RETURN_COMPLETED: 'Hoàn tất trả hàng thành công!',
    CREATE_SUCCESS: 'Gửi yêu cầu trả hàng thành công!',
    APPROVE_SUCCESS: 'Duyệt yêu cầu trả hàng thành công!',
    REJECT_SUCCESS: 'Từ chối yêu cầu trả hàng thành công!',
    SHIPPING_SUCCESS: 'Cập nhật trạng thái gửi hàng thành công!',
    RECEIVED_SUCCESS: 'Xác nhận đã nhận hàng thành công!',
    COMPLETE_SUCCESS: 'Hoàn tất trả hàng và hoàn tiền thành công!'
  }
};

module.exports = RETURN_CONSTANTS;