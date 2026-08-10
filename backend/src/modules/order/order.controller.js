const orderService = require('./order.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { ORDER_MESSAGES } = require('./order.constants');

const orderController = {
  previewCheckout: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await orderService.previewOrder(userId, req.body);
      return sendSuccess(res, 200, ORDER_MESSAGES.PREVIEW_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  createOrder: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await orderService.createOrder(userId, req.body);
      return sendSuccess(res, 201, ORDER_MESSAGES.CREATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

getMyOrders: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10, status } = req.query; 
      
      const result = await orderService.getUserOrders(userId, { page, limit, status });
      return sendSuccess(res, 200, 'Lấy danh sách đơn hàng thành công', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const result = await orderService.getOrderById(userId, id);
      return sendSuccess(res, 200, 'Lấy chi tiết đơn hàng thành công', result);
    } catch (err) {
      console.log("🛑 LỖI BACKEND CỤ THỂ LÀ:", err);
      return sendError(res, 404, err.message);
    }
  },

  cancelOrder: async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { cancelReason } = req.body;

    const result = await orderService.cancelOrder(
      userId,
      id,
      cancelReason
    );

    return sendSuccess(
      res,
      200,
      'Hủy đơn hàng thành công.',
      result
    );
  } catch (err) {
    return sendError(
      res,
      400,
      err.message
    );
  }
},
};

module.exports = orderController;