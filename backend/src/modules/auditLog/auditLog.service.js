const auditLogRepository = require('./auditLog.repository');

const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const DEFAULT_LIMIT = 20;

const auditLogService = {
  /**
   * Ghi audit log
   */
  createAuditLog: async ({
    userId,
    action,
    entityName,
    entityId = null,
    oldValues = null,
    newValues = null
  }) => {
    return await auditLogRepository.create({
      userId,
      action,
      entityName,
      entityId,
      oldValues,
      newValues
    });
  },

  /**
   * Lấy danh sách audit log
   */
  getAllAuditLogs: async (queryParams = {}) => {
    const {
      search,
      userId,
      action,
      entityName,
      entityId,
      fromDate,
      toDate,
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const {
      page,
      limit,
      skip
    } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const {
      auditLogs,
      totalItems
    } = await auditLogRepository.findAllPaginated({
      search,
      userId,
      action,
      entityName,
      entityId,
      fromDate,
      toDate,
      skip,
      take: limit
    });

    return {
      auditLogs,
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  /**
   * Lấy chi tiết audit log
   */
  getAuditLogById: async id => {
    const auditLog =
      await auditLogRepository.findById(id);

    if (!auditLog) {
      throw new Error(
        'Không tìm thấy audit log!'
      );
    }

    return auditLog;
  }
};

module.exports = auditLogService;