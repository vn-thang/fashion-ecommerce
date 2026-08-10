const userService = require('./user.service');
const { MESSAGES } = require('./user.constants');
const { sendSuccess, sendError } = require('../../utils/response');

const userController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await userService.getProfile(userId);
      return sendSuccess(res, 200, MESSAGES.PROFILE_FETCH_SUCCESS, result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await userService.updateProfile(userId, req.body);
      return sendSuccess(res, 200, MESSAGES.PROFILE_UPDATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  uploadAvatar: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không tìm thấy file ảnh đính kèm!' });
      }

      const avatarUrl = req.file.path; 
      const userId = req.user.userId; 

      const updatedUser = await userService.updateProfile(userId, { avatarUrl });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật ảnh đại diện thành công!',
        user: updatedUser
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAddresses: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await userService.getAddresses(userId);
      return sendSuccess(res, 200, MESSAGES.ADDRESS_FETCH_SUCCESS, result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  addAddress: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await userService.addAddress(userId, req.body);
      return sendSuccess(res, 201, MESSAGES.ADDRESS_CREATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  updateAddress: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { addressId } = req.params;
      const result = await userService.updateAddress(userId, addressId, req.body);
      return sendSuccess(res, 200, MESSAGES.ADDRESS_UPDATE_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { addressId } = req.params;
      await userService.deleteAddress(userId, addressId);
      return sendSuccess(res, 200, MESSAGES.ADDRESS_DELETE_SUCCESS);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  setAddressDefault: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { addressId } = req.params;
      const result = await userService.setAddressDefault(userId, addressId);
      return sendSuccess(res, 200, MESSAGES.ADDRESS_SET_DEFAULT_SUCCESS, result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = userController;