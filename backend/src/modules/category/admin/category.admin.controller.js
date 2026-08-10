const categoryService = require('../category.service');
const { sendSuccess, sendError } = require('../../../utils/response');

const categoryAdminController = {
  create: async (req, res) => {
    try {
      const result = await categoryService.createCategory(req.body);
      return sendSuccess(res, 201, 'Tạo danh mục thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await categoryService.getAllCategories(req.query);
      return sendSuccess(res, 200, 'Lấy danh sách danh mục thành công!', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await categoryService.updateCategory(
        req.params.id,
        req.body
      );

      return sendSuccess(res, 200, 'Cập nhật danh mục thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  deactivate: async (req, res) => {
    try {
      const result = await categoryService.deactivateCategory(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Ẩn danh mục thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  activate: async (req, res) => {
    try {
      const result = await categoryService.activateCategory(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Kích hoạt danh mục thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  }
};

module.exports = categoryAdminController;