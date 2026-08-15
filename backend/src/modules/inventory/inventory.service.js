const inventoryRepository = require('./inventory.repository');
const { MESSAGES } = require('./inventory.constants');
const paginationHelper = require('../../utils/pagination');
const auditLogService = require('../auditLog/auditLog.service');

const inventoryService = {
  importStock: async (data, userId) => {
    const variant = await inventoryRepository.findVariantById(
      data.productVariantId
    );

    if (!variant) {
      throw new Error(MESSAGES.VARIANT_NOT_FOUND);
    }

    const quantity = Number(data.quantity);

    const result = await inventoryRepository.importStockTransaction({
      productVariantId: data.productVariantId,
      quantity,
      note: data.note || 'Nhập kho',
      createdBy: userId
    });

    await auditLogService.createAuditLog({
      userId,
      action: 'IMPORT_STOCK',
      entityName: 'ProductVariant',
      entityId: data.productVariantId,
      oldValues: {
        stockQuantity: variant.stockQuantity
      },
      newValues: {
        stockQuantity: variant.stockQuantity + quantity,
        quantity
      }
    });

    return result;
  },

  adjustStock: async (data, userId) => {
    const variant = await inventoryRepository.findVariantById(
      data.productVariantId
    );

    if (!variant) {
      throw new Error(MESSAGES.VARIANT_NOT_FOUND);
    }

    const quantity = Number(data.quantity);

    if (variant.stockQuantity + quantity < 0) {
      throw new Error(MESSAGES.INVALID_STOCK);
    }

    const result =
      await inventoryRepository.adjustmentStockTransaction({
        productVariantId: data.productVariantId,
        quantity,
        note: data.note || 'Điều chỉnh tồn kho',
        createdBy: userId
      });

    await auditLogService.createAuditLog({
      userId,
      action: 'ADJUST_STOCK',
      entityName: 'ProductVariant',
      entityId: data.productVariantId,
      oldValues: {
        stockQuantity: variant.stockQuantity
      },
      newValues: {
        stockQuantity: variant.stockQuantity + quantity,
        quantity
      }
    });

    return result;
  },

getTransactions: async query => {
  const { page, limit, skip } =
    paginationHelper.getPagination(
      query.page,
      query.limit
    );

  const where = {};

  if (query.type) {
    where.type = query.type;
  }

  if (query.productVariantId) {
    where.productVariantId = query.productVariantId;
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {};

    if (query.startDate) {
      where.createdAt.gte = new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  if (query.keyword) {
    where.OR = [
      {
        variant: {
          sku: {
            contains: query.keyword,
            mode: 'insensitive'
          }
        }
      },
      {
        variant: {
          product: {
            name: {
              contains: query.keyword,
              mode: 'insensitive'
            }
          }
        }
      }
    ];
  }

  const { transactions, totalItems } =
    await inventoryRepository.findTransactions({
      skip,
      limit,
      where
    });

  return {
    transactions,
    pagination:
      paginationHelper.getPaginationMetadata(
        totalItems,
        page,
        limit
      )
  };
},

  getTransactionDetail: async id => {
    const transaction =
      await inventoryRepository.findTransactionById(id);

    if (!transaction) {
      throw new Error(MESSAGES.TRANSACTION_NOT_FOUND);
    }

    return transaction;
  },

getVariants: async keyword => {
  if (!keyword || !keyword.trim()) {
    return [];
  }

  const keywords = keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const where = {
    OR: [
      {
        sku: {
          contains: keyword.trim(),
          mode: 'insensitive'
        }
      },
      {
        product: {
          AND: keywords.map(word => ({
            name: {
              contains: word,
              mode: 'insensitive'
            }
          }))
        }
      }
    ]
  };

  return inventoryRepository.findVariants({
    where,
    take: 30
  });
},
};

module.exports = inventoryService;