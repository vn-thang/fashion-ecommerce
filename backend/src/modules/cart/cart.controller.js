const cartService = require('./cart.service');
const { sendSuccess, sendError } = require('../../utils/response');

const cartController = {
  getCart: async (req, res) => {
    try {
      const userId = req.user.userId; 
      const result = await cartService.getCart(userId);
      return sendSuccess(res, 200, 'Lấy thông tin giỏ hàng thành công', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user.userId; 
      const result = await cartService.addToCart(userId, req.body);
      return sendSuccess(res, 200, 'Thêm vào giỏ hàng thành công', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
      const { quantity } = req.body;
      const result = await cartService.updateItemQuantity(userId, itemId, quantity);
      return sendSuccess(res, 200, 'Cập nhật số lượng thành công', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  removeItem: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
      const result = await cartService.removeItem(userId, itemId);
      return sendSuccess(res, 200, 'Đã xóa sản phẩm khỏi giỏ hàng', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  clearCart: async (req, res) => {
    try {
      const userId = req.user.userId; 
      await cartService.clearCart(userId);
      return sendSuccess(res, 200, 'Đã làm sạch giỏ hàng');
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = cartController;