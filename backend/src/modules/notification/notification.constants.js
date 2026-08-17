const NOTIFICATION_CONSTANTS = {
  TYPE: {
    // Order
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_CONFIRMED: 'ORDER_CONFIRMED',
    ORDER_SHIPPING: 'ORDER_SHIPPING',
    ORDER_SUCCESS: 'ORDER_SUCCESS',
    ORDER_CANCELLED: 'ORDER_CANCELLED',

    // Payment
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    PAYMENT_FAILED: 'PAYMENT_FAILED',

    // Account
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    ACCOUNT_ACTIVATED: 'ACCOUNT_ACTIVATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',

    REVIEW_REPLIED: 'REVIEW_REPLIED',

    // Marketing
    FLASH_SALE: 'FLASH_SALE',
    COUPON: 'COUPON',

    SYSTEM: 'SYSTEM',

    ADMIN_NEW_ORDER: 'ADMIN_NEW_ORDER',
    ADMIN_ORDER_CANCELLED: 'ADMIN_ORDER_CANCELLED',
    ADMIN_PAYMENT_SUCCESS: 'ADMIN_PAYMENT_SUCCESS',
    ADMIN_PAYMENT_CANCELLED: 'ADMIN_PAYMENT_CANCELLED',
    ADMIN_PAYMENT_FAILED: 'ADMIN_PAYMENT_FAILED',
    ADMIN_NEW_REVIEW: 'ADMIN_NEW_REVIEW',
    ADMIN_LOW_STOCK: 'ADMIN_LOW_STOCK'
  },

  MESSAGES: {
    USER_ID_REQUIRED: 'Mã người dùng là bắt buộc!',
    TITLE_REQUIRED: 'Tiêu đề thông báo là bắt buộc!',
    CONTENT_REQUIRED: 'Nội dung thông báo là bắt buộc!',
    INVALID_ID: 'Mã định danh thông báo (ID) phải là định dạng UUID hợp lệ!',
    NOT_FOUND: 'Thông báo không tồn tại!',
    MARK_READ_SUCCESS: 'Đánh dấu thông báo đã đọc thành công!',
    MARK_ALL_READ_SUCCESS: 'Đánh dấu tất cả thông báo đã đọc thành công!',
    GET_SUCCESS: 'Lấy danh sách thông báo thành công!',
    GET_UNREAD_SUCCESS: 'Lấy số lượng thông báo chưa đọc thành công!',
    CREATE_SUCCESS: 'Tạo thông báo thành công!',
    TOKEN_REQUIRED: 'FCM Token là bắt buộc!',
    TOKEN_SAVED: 'Đăng ký thiết bị nhận thông báo thành công!'
  },

  ORDER: {
    CREATED_TITLE: 'Đặt hàng thành công',

    CREATED_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đã được tạo thành công.`,

    CONFIRMED_TITLE: 'Đơn hàng đã được xác nhận',

    CONFIRMED_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đã được xác nhận và đang được xử lý.`,

    SHIPPING_TITLE: 'Đơn hàng đang được giao',

    SHIPPING_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đang được giao đến bạn.`,

    SUCCESS_TITLE: 'Đơn hàng đã hoàn tất',

    SUCCESS_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,

    CANCELLED_TITLE: 'Đơn hàng đã được hủy',

    CANCELLED_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đã được hủy.`
  },

  ACCOUNT: {
    LOCKED_TITLE: 'Tài khoản đã bị khóa',

    LOCKED_CONTENT: 'Tài khoản của bạn đã bị quản trị viên khóa. Vui lòng liên hệ quản trị viên để biết thêm thông tin.',

    ACTIVATED_TITLE: 'Tài khoản đã được mở khóa',

    ACTIVATED_CONTENT: 'Tài khoản của bạn đã được quản trị viên mở khóa. Bạn có thể tiếp tục sử dụng dịch vụ.',

    PASSWORD_CHANGED_TITLE: 'Đổi mật khẩu thành công',

    PASSWORD_CHANGED_CONTENT: 'Mật khẩu của bạn đã được thay đổi thành công. Bạn sẽ cần đăng nhập lại trên các thiết bị.'
  },

  REVIEW: {
  REPLIED_TITLE: 'Đánh giá của bạn đã được phản hồi',

  REPLIED_CONTENT: productName =>
    `Quản trị viên đã phản hồi đánh giá của bạn về sản phẩm "${productName}".`
},
  FLASH_SALE: {
  STARTED_TITLE: '🔥 Flash Sale bắt đầu!',
  STARTED_CONTENT: name =>
    `Flash Sale "${name}" đã bắt đầu. Xem ngay các sản phẩm đang giảm giá!`
},

COUPON: {
  AVAILABLE_TITLE: '🎁 Ưu đãi đặc biệt dành cho bạn',

  AVAILABLE_CONTENT: ({
    discountText,
    minOrderAmount
  }) =>
    `Giảm ${discountText} cho đơn hàng từ ${minOrderAmount}. Mua ngay để nhận ưu đãi hấp dẫn từ FashionHub!`
},

ADMIN: {
  NEW_ORDER_TITLE: 'Có đơn hàng mới',
  NEW_ORDER_CONTENT: orderNumber => `Khách hàng vừa đặt đơn hàng ${orderNumber}.`,
  ORDER_CANCELLED_TITLE: 'Đơn hàng bị hủy',
  ORDER_CANCELLED_CONTENT: orderNumber => `Đơn hàng ${orderNumber} vừa được khách hàng hủy.`,
  PAYMENT_SUCCESS_TITLE: 'Thanh toán thành công',
  PAYMENT_SUCCESS_TITLE: 'Thanh toán thành công',
  PAYMENT_SUCCESS_CONTENT: orderNumber => `Đơn hàng ${orderNumber} đã được thanh toán thành công.`,
  PAYMENT_CANCELLED_TITLE: 'Thanh toán bị hủy',
  PAYMENT_CANCELLED_CONTENT: orderNumber => `Thanh toán của đơn hàng ${orderNumber} đã bị hủy.`,
  PAYMENT_FAILED_TITLE: 'Thanh toán thất bại',
  PAYMENT_FAILED_CONTENT: orderNumber => `Thanh toán của đơn hàng ${orderNumber} đã thất bại.`,
  NEW_REVIEW_TITLE: 'Có đánh giá mới',
  NEW_REVIEW_CONTENT: productName => `Khách hàng vừa đánh giá sản phẩm "${productName}".`,
  LOW_STOCK_TITLE: 'Sản phẩm sắp hết hàng',
  LOW_STOCK_CONTENT: productName => `Sản phẩm "${productName}" sắp hết hàng.`
},
};

module.exports = NOTIFICATION_CONSTANTS;