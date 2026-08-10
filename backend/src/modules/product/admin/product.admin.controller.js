const productService = require('../product.service');
const { sendSuccess, sendError } = require('../../../utils/response');

const productAdminController = {
  createProduct: async (req, res) => {
    try {
      const result = await productService.createProduct(
        req.body,
        req.file
      );

      return sendSuccess(
        res,
        201,
        'Tạo sản phẩm thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  uploadAlbum: async (req, res) => {
    try {
      const result = await productService.uploadAlbumImages(
        req.params.productId,
        req.files
      );

      return sendSuccess(
        res,
        201,
        'Tải album thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  createVariant: async (req, res) => {
    try {
      const adminId = req.user?.userId;

      if (!adminId) {
        return sendError(
          res,
          401,
          'Không tìm thấy thông tin tài khoản Admin!'
        );
      }

      const result = await productService.createVariant(
        req.params.productId,
        req.body,
        adminId
      );

      return sendSuccess(
        res,
        201,
        'Tạo biến thể thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await productService.getAllProducts(
        req.query
      );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách sản phẩm Admin thành công',
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const result = await productService.getProductById(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Lấy chi tiết sản phẩm thành công',
        result
      );
    } catch (err) {
      return sendError(res, 404, err.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const result = await productService.updateProduct(
        req.params.id,
        req.body,
        req.file
      );

      return sendSuccess(
        res,
        200,
        'Cập nhật sản phẩm thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  updateVariant: async (req, res) => {
    try {
      const result = await productService.updateVariant(
        req.params.id,
        req.body
      );

      return sendSuccess(
        res,
        200,
        'Cập nhật biến thể thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);

      return sendSuccess(
        res,
        200,
        'Tắt sản phẩm thành công!'
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  deleteVariant: async (req, res) => {
    try {
      await productService.deleteVariant(req.params.id);

      return sendSuccess(
        res,
        200,
        'Tắt biến thể thành công!'
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  activateVariant: async (req, res) => {
  try {
    const result = await productService.activateVariant(req.params.id);

    return sendSuccess(
      res,
      200,
      'Hiện lại phân loại thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},

deleteImage: async (req, res) => {
  try {
    await productService.deleteProductImage(
      req.params.productId,
      req.params.imageId
    );

    return sendSuccess(res, 200, 'Xóa ảnh thành công!');
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},
};

module.exports = productAdminController;