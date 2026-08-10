const BRAND_CONSTANTS = {
  STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  },
  MESSAGES: {
    NAME_REQUIRED: 'Tên thương hiệu là bắt buộc và không được để trống!',
    LOGO_REQUIRED: 'Logo thương hiệu là bắt buộc, vui lòng chọn file ảnh!',
    SLUG_EXISTED: 'Thương hiệu với tên này đã tồn tại trên hệ thống!',
    INVALID_ID: 'Mã định danh thương hiệu (ID) phải là định dạng UUID hợp lệ!',
    NOT_FOUND: 'Thương hiệu không tồn tại!',
    ALREADY_ACTIVE: 'Thương hiệu đang ở trạng thái hoạt động!',
    ALREADY_INACTIVE: 'Thương hiệu đã được ẩn!',
    ACTIVATE_SUCCESS: 'Kích hoạt thương hiệu thành công!',
    DEACTIVATE_SUCCESS: 'Ẩn thương hiệu thành công!'
  }
};

module.exports = BRAND_CONSTANTS;