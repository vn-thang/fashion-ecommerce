const MESSAGES = {
  COUPON_NOT_FOUND: 'Mã giảm giá này không tồn tại trên hệ thống!',
  CODE_EXISTED: 'Mã Code này đã tồn tại, vui lòng chọn mã khác!',
  CODE_REQUIRED: 'Mã Code là bắt buộc và không được để trống!',
  INVALID_DATE: 'Ngày kết thúc phải diễn ra sau ngày bắt đầu!',
  INVALID_DISCOUNT_TYPE: 'Loại giảm giá không hợp lệ (Chỉ nhận PERCENTAGE hoặc FIXED)!',
  INVALID_ID: 'Mã định danh (ID) không đúng định dạng UUID!',
  INVALID_VALUES: 'Các giá trị giảm giá, đơn tối thiểu và số lượt dùng phải là số dương!',
  CREATE_SUCCESS: 'Tạo mã giảm giá thành công!',
  UPDATE_SUCCESS: 'Cập nhật mã giảm giá thành công!',
  DELETE_SUCCESS: 'Ngừng kích hoạt mã giảm giá thành công!',
  FETCH_SUCCESS: 'Lấy dữ liệu mã giảm giá thành công!',
  COUPON_ALREADY_INACTIVE: 'Mã giảm giá đã được ngừng kích hoạt!',
  COUPON_IN_PROGRESS: 'Không thể tắt mã giảm giá đang diễn ra.',
  COUPON_ALREADY_EXPIRED: 'Mã giảm giá đã hết hạn.',
};

module.exports = { MESSAGES };