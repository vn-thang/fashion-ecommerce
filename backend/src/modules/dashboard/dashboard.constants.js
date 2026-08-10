const DASHBOARD_MESSAGES = {
  GET_SUCCESS: 'Lấy dữ liệu Dashboard thành công.',

  INVALID_DATE: 'Khoảng thời gian không hợp lệ.',
  START_DATE_REQUIRED: 'Vui lòng chọn ngày bắt đầu.',
  END_DATE_REQUIRED: 'Vui lòng chọn ngày kết thúc.',
  START_DATE_AFTER_END_DATE:
    'Ngày bắt đầu không được lớn hơn ngày kết thúc.'
};

const DASHBOARD_PERIOD = {
  TODAY: 'today',
  LAST_7_DAYS: '7days',
  LAST_30_DAYS: '30days',
  THIS_MONTH: 'month',
  THIS_YEAR: 'year',
  CUSTOM: 'custom'
};

const DASHBOARD_LIMIT = {
  TOP_PRODUCTS: 5,
  TOP_CUSTOMERS: 5
};

const LOW_STOCK_THRESHOLD = 10;

module.exports = {
  DASHBOARD_MESSAGES,
  DASHBOARD_PERIOD,
  DASHBOARD_LIMIT,
  LOW_STOCK_THRESHOLD
};