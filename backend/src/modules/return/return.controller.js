const returnService = require('./return.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { MESSAGES } = require('./return.constants');

const returnController = {
  create: async (req, res) => {
    try {
      const result =
        await returnService.createReturnRequest(
          req.user.userId,
          req.body
        );

      return sendSuccess(
        res,
        201,
        MESSAGES.CREATE_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result =
        await returnService.getCustomerReturns(
          req.user.userId,
          req.query
        );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách yêu cầu trả hàng thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getByOrderId: async (req, res) => {
  try {
    const result =
      await returnService.getReturnsByOrderId(
        req.user.userId,
        req.params.orderId
      );

    return sendSuccess(
      res,
      200,
      'Lấy lịch sử trả hàng của đơn hàng thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},

  getById: async (req, res) => {
    try {
      const result =
        await returnService.getReturnByCustomer(
          req.user.userId,
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        'Lấy chi tiết yêu cầu trả hàng thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  markShipping: async (req, res) => {
    try {
      const result =
        await returnService.markShipping(
          req.user.userId,
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        MESSAGES.SHIPPING_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  cancel: async (req, res) => {
  try {
    const result =
      await returnService.cancelReturnRequest(
        req.user.userId,
        req.params.id
      );

    return sendSuccess(
      res,
      200,
      'Hủy yêu cầu trả hàng thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},
};

module.exports = returnController;