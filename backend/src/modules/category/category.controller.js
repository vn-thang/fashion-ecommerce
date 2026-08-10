const categoryService = require('./category.service');
const { sendSuccess, sendError } = require('../../utils/response');

const categoryController = {
  getAllActive: async (req, res) => {
    try {
      const result = await categoryService.getAllActiveCategories();
      return sendSuccess(res, 200, 'Lấy danh sách danh mục thành công!', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
};

module.exports = categoryController;