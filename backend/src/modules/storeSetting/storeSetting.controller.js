const storeSettingService = require('./storeSetting.service');
const { sendSuccess, sendError } = require('../../utils/response');

const storeSettingController = {
  get: async (req, res) => {
    try {
      const result = await storeSettingService.getStoreSetting();
      return sendSuccess(res, 200, 'Lấy thông tin cửa hàng thành công', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await storeSettingService.updateStoreSetting(
        req.body,
        req.file
      );

      return sendSuccess(
        res,
        200,
        'Cập nhật thông tin cửa hàng thành công',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = storeSettingController;