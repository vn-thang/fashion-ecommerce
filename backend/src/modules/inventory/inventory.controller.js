const inventoryService = require('./inventory.service');
const { INVENTORY_MESSAGES } = require('./inventory.constants');

const inventoryController = {
  importStock: async (req, res) => {
    try {
      const transaction = await inventoryService.importStock(
        req.body,
        req.user.userId
      );

      return res.status(201).json({
        success: true,
        message: INVENTORY_MESSAGES.IMPORT_SUCCESS,
        data: transaction
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  adjustStock: async (req, res) => {
    try {
      const transaction = await inventoryService.adjustStock(
        req.body,
        req.user.userId
      );

      return res.status(200).json({
        success: true,
        message: INVENTORY_MESSAGES.ADJUST_SUCCESS,
        data: transaction
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const result = await inventoryService.getTransactions(req.query);

      return res.status(200).json({
        success: true,
        message: 'Lấy lịch sử kho thành công.',
        data: result.transactions,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getTransactionDetail: async (req, res) => {
    try {
      const transaction =
        await inventoryService.getTransactionDetail(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  getVariants: async (req, res) => {
    try {
      const variants =
        await inventoryService.getVariants(
          req.query.keyword
        );

      return res.status(200).json({
        success: true,
        data: variants
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = inventoryController;