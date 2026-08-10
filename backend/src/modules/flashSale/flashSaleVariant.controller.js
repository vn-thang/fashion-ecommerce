const flashSaleVariantService = require('./flashSaleVariant.service');
const { sendSuccess, sendError } = require('../../utils/response');

const flashSaleVariantController = {

  addVariants: async (req, res) => {
    try {
      const result = await flashSaleVariantService.addVariants(
        req.params.flashSaleId,
        req.body.variants
      );

      return sendSuccess(
        res,
        201,
        'Thêm sản phẩm vào Flash Sale thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result =
        await flashSaleVariantService.getFlashSaleVariants(
          req.params.flashSaleId,
          req.query
        );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách sản phẩm Flash Sale thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const result =
        await flashSaleVariantService.getById(
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        'Lấy chi tiết Flash Sale Variant thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 404, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result =
        await flashSaleVariantService.update(
          req.params.id,
          req.body
        );

      return sendSuccess(
        res,
        200,
        'Cập nhật Flash Sale Variant thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  remove: async (req, res) => {
    try {
      await flashSaleVariantService.remove(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Xóa sản phẩm khỏi Flash Sale thành công!'
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAvailableVariants: async (req, res) => {
    try {
      const result =
        await flashSaleVariantService.getAvailableVariants(
          req.params.flashSaleId,
          req.query
        );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách sản phẩm khả dụng thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
};

module.exports = flashSaleVariantController;