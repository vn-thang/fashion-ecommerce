/**
 * Tiện ích chuẩn hóa dữ liệu trả về cho toàn bộ API
 */
const responseHelper = {

  sendSuccess: (res, statusCode = 200, message = 'Thành công', data = null) => {
    const response = {
      success: true,
      message
    };
    if (data !== null) response.data = data;
    
    return res.status(statusCode).json(response);
  },

  sendError: (res, statusCode = 500, message = 'Đã xảy ra lỗi hệ thống', errors = null) => {
    const response = {
      success: false,
      message
    };
    if (errors !== null) response.errors = errors;

    return res.status(statusCode).json(response);
  }
};

module.exports = responseHelper;