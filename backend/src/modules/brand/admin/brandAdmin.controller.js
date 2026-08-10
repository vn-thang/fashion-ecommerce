const brandService = require('../brand.service');
const { sendSuccess, sendError } = require('../../../utils/response');

const brandAdminController = {
  create: async (req, res) => {
    try {
      const result = await brandService.createBrand(req.body, req.file);
      return sendSuccess(res, 201, 'Tạo thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await brandService.getAllBrands(req.query);
      return sendSuccess(res, 200, 'Lấy danh sách thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await brandService.updateBrand(
        req.params.id,
        req.body,
        req.file
      );
      return sendSuccess(res, 200, 'Cập nhật thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  deactivate: async (req, res) => {
    try {
      const result = await brandService.deactivateBrand(req.params.id);
      return sendSuccess(res, 200, 'Ẩn thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  activate: async (req, res) => {
    try {
      const result = await brandService.activateBrand(req.params.id);
      return sendSuccess(res, 200, 'Kích hoạt thương hiệu thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = brandAdminController;