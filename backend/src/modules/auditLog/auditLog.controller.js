const auditLogService = require('./auditLog.service');

const {
  sendSuccess,
  sendError
} = require('../../utils/response');

const auditLogController = {
  getAll: async (req, res) => {
    try {
      const result =
        await auditLogService.getAllAuditLogs(
          req.query
        );

      return sendSuccess(
        res,
        200,
        'Lấy danh sách audit log thành công!',
        result
      );
    } catch (err) {
      return sendError(
        res,
        500,
        err.message
      );
    }
  },

  getById: async (req, res) => {
    try {
      const result =
        await auditLogService.getAuditLogById(
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        'Lấy chi tiết audit log thành công!',
        result
      );
    } catch (err) {
      return sendError(
        res,
        404,
        err.message
      );
    }
  }
};

module.exports = auditLogController;