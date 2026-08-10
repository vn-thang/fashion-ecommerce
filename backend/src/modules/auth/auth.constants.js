module.exports = {
  TOKEN_EXPIRY: {
    ACCESS: '15m',
    REFRESH: '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000 // 7 ngày tính bằng miligiây
  },
  ROLES: {
    ADMIN: 'Admin',
    CUSTOMER: 'Customer'
  },
  MESSAGES: {
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    REFRESH_SUCCESS: 'Cấp lại Access Token thành công!',
    EXISTING_USER: 'Email hoặc Số điện thoại này đã được đăng ký!',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác!',
    ACCOUNT_LOCKED: 'Tài khoản của bạn hiện đang bị khóa!',
    UNAUTHORIZED: 'Bạn chưa đăng nhập hoặc Token không hợp lệ!',
    FORBIDDEN: 'Bạn không có quyền truy cập vào tính năng này!',
    SERVER_ERROR: 'Đã có lỗi hệ thống xảy ra, vui lòng thử lại sau.'
  }
};