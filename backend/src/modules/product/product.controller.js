const productService = require('./product.service');
const { sendSuccess, sendError } = require('../../utils/response');

const productController = {
  getAll: async (req, res) => {
    try {
      const result = await productService.getProductsClient(
        req.query
      );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách sản phẩm thành công',
        result
      );
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  },

  getByIdClient: async (req, res) => {
  try {
    const result = await productService.getProductByIdClient(req.params.id);

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

  getBySlug: async (req, res) => {
    try {
      const result =
        await productService.getProductBySlugClient(
          req.params.slug
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

  getRelatedProducts: async (req, res) => {
    try {
      const result =
        await productService.getRelatedProducts(
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        'Lấy sản phẩm liên quan thành công',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getBestSellingProducts: async (req, res) => {
    try {
      const result =
        await productService.getBestSellingProducts();

      return sendSuccess(
        res,
        200,
        'Lấy sản phẩm bán chạy thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getNewestProducts: async (req, res) => {
    try {
      const result =
        await productService.getNewestProducts();

      return sendSuccess(
        res,
        200,
        'Lấy sản phẩm mới thành công!',
        result
      );
    } catch (err) {
      return sendError(res, 400, err.message);
    }
  },

  getHighestRatedProducts: async (req, res) => {
  try {
    const result =
      await productService.getHighestRatedProducts();

    return sendSuccess(
      res,
      200,
      'Lấy sản phẩm được đánh giá cao thành công!',
      result
    );
  } catch (err) {
    return sendError(res, 400, err.message);
  }
},

  getSearchSuggestions : async (req, res) => {
  try {
    const { search } = req.query;

    const suggestions =
      await productService.getSearchSuggestions(search);

    return res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error(
      'Lỗi lấy search suggestions:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Không thể lấy gợi ý tìm kiếm'
    });
  }
}
};

module.exports = productController; 