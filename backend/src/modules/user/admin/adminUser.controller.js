const userService = require('../user.service');
const { MESSAGES } = require('../user.constants');
const { sendSuccess, sendError } = require('../../../utils/response');

const adminUserController = {
  getAllUsers: async (req, res) => {
    try {
      const result = await userService.getAllUsers(req.query);

      return sendSuccess(
        res,
        200,
        MESSAGES.USER_LIST_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getUserDetail: async (req, res) => {
    try {
      const result = await userService.getUserDetail(
        req.params.userId
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.USER_DETAIL_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      const result = await userService.updateUserStatus(
        req.user.userId,
        req.params.userId,
        req.body.isActive
      );

      return sendSuccess(
        res,
        200,
        MESSAGES.USER_STATUS_UPDATE_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = adminUserController;