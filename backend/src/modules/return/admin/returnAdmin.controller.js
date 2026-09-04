const returnService = require('../return.service');
const { sendSuccess, sendError } = require('../../../utils/response');
const { MESSAGES } = require('../return.constants');

const returnAdminController = {
  getAll: async (req, res) => {
    try {
      const result =
        await returnService.getAllReturns(
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

  getById: async (req, res) => {
    try {
      const result =
        await returnService.getReturnByAdmin(
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

  approve: async (req, res) => {
    try {
      const result =
        await returnService.approveReturn(
          req.user.userId,
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        MESSAGES.APPROVE_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  reject: async (req, res) => {
    try {
      const result =
        await returnService.rejectReturn(
          req.user.userId,
          req.params.id,
          req.body.rejectReason
        );

      return sendSuccess(
        res,
        200,
        MESSAGES.REJECT_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  received: async (req, res) => {
    try {
      const result =
        await returnService.markReceived(
          req.user.userId,
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        MESSAGES.RECEIVED_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  complete: async (req, res) => {
    try {
      const ipAddress =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress;

      const result =
        await returnService.completeReturn(
          req.user.userId,
          req.params.id,
          ipAddress
        );

      return sendSuccess(
        res,
        200,
        MESSAGES.COMPLETE_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = returnAdminController;