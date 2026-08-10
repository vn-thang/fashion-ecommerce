const orderService = require('../order.service');
const { sendSuccess, sendError } = require('../../../utils/response'); 

const adminOrderController = {

  getAllOrdersForAdmin: async (req, res) => {
    try {
      const result = await orderService.getOrdersForAdmin(req.query);
      return sendSuccess(res, 200, 'Lấy danh sách đơn hàng thành công', result);
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  },

  getOrderDetailForAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderDetailForAdmin(id);
      return sendSuccess(res, 200, 'Lấy chi tiết đơn hàng thành công', order);
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 

      if (!status) {
        return sendError(res, 400, 'Vui lòng cung cấp trạng thái cần cập nhật (status)');
      }

      const updatedOrder = await orderService.updateOrderStatusByAdmin(id, status);
      return sendSuccess(res, 200, 'Cập nhật trạng thái đơn hàng thành công', updatedOrder);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  },

cancelOrder: async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const result =
      await orderService.cancelOrderByAdmin(
        id,
        cancelReason
      );

    return sendSuccess(
      res,
      200,
      result.message,
      result
    );
  } catch (error) {
    return sendError(res, 400, error.message);
  }
}
};

module.exports = adminOrderController;