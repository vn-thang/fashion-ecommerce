const brandService = require('./brand.service');
const { sendSuccess, sendError } = require('../../utils/response');

const brandController = {
  getAllActive: async (req, res) => {
    try {
      const result = await brandService.getAllActiveBrands(req.query);
      return sendSuccess(res, 200, 'Lấy danh sách thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
};

module.exports = brandController;