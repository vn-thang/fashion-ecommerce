const flashSaleService = require('./flashSale.service');
const { sendSuccess, sendError } = require('../../utils/response');

const flashSaleController = {
  create: async (req, res) => {
    try {
      const result = await flashSaleService.createFlashSale(req.body);
      return sendSuccess(res, 201, 'Tạo chương trình Flash Sale thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await flashSaleService.getAllFlashSales(req.query);
      return sendSuccess(res, 200, 'Lấy danh sách Flash Sale thành công!', result);
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const result = await flashSaleService.getFlashSaleById(req.params.id);
      return sendSuccess(res, 200, 'Lấy chi tiết Flash Sale thành công!', result);
    } catch (err) {
      return sendError(res, 404, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await flashSaleService.updateFlashSale(req.params.id, req.body);
      return sendSuccess(res, 200, 'Cập nhật Flash Sale thành công!', result);
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  disable: async (req, res) => {
    try {
      await flashSaleService.disableFlashSale(req.params.id);
      return sendSuccess(res, 200, 'Ngừng kích hoạt Flash Sale thành công!');
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getActive: async (req, res) => {
  try {
    const result = await flashSaleService.getActiveFlashSale();

    return sendSuccess(
      res,
      200,
      'Lấy Flash Sale đang diễn ra thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
},
getCustomerFlashSale: async (req, res) => {
  try {
    const result = await flashSaleService.getCustomerFlashSale(req.query);

    return sendSuccess(
      res,
      200,
      'Lấy danh sách sản phẩm Flash Sale thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
},
};

module.exports = flashSaleController;