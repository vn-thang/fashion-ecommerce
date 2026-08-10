const prisma = require('../../config/database');

const inventoryRepository = {
  findVariantById: async id => {
    return await prisma.productVariant.findUnique({
      where: {
        id
      },
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  importStockTransaction: async ({
    productVariantId,
    quantity,
    note,
    createdBy
  }) => {
    return await prisma.$transaction(async tx => {
      const variant = await tx.productVariant.findUnique({
        where: {
          id: productVariantId
        }
      });

      const newStock = variant.stockQuantity + quantity;

      await tx.productVariant.update({
        where: {
          id: productVariantId
        },
        data: {
          stockQuantity: newStock
        }
      });

      return await tx.inventoryTransaction.create({
        data: {
          productVariantId,
          type: 'Import',
          quantity,
          balanceAfter: newStock,
          note,
          createdBy
        }
      });
    });
  },

  adjustmentStockTransaction: async ({
    productVariantId,
    quantity,
    note,
    createdBy
  }) => {
    return await prisma.$transaction(async tx => {
      const variant = await tx.productVariant.findUnique({
        where: {
          id: productVariantId
        }
      });

      const newStock = variant.stockQuantity + quantity;
      if (newStock < 0) {
          throw new Error('Tồn kho không đủ.');
      }

      await tx.productVariant.update({
        where: {
          id: productVariantId
        },
        data: {
          stockQuantity: newStock
        }
      });

      return await tx.inventoryTransaction.create({
        data: {
          productVariantId,
          type: 'Adjustment',
          quantity,
          balanceAfter: newStock,
          note,
          createdBy
        }
      });
    });
  },

findTransactions: async ({
  skip,
  limit,
  where
}) => {
  const [transactions, totalItems] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        variant: {
          select: {
            id: true,
            sku: true,
            color: true,
            size: true,
            stockQuantity: true,
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    }),
    prisma.inventoryTransaction.count({
      where
    })
  ]);

  return {
    transactions,
    totalItems
  };
},

  findTransactionById: async id => {
  return await prisma.inventoryTransaction.findUnique({
    where: {
      id
    },
    include: {
      variant: {
        select: {
          id: true,
          sku: true,
          color: true,
          size: true,
          stockQuantity: true,
          product: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
},

findVariants: async ({
  where,
  take = 20
}) => {
  return await prisma.productVariant.findMany({
    where,
    take,
    orderBy: [
      {
        product: {
          name: 'asc'
        }
      },
      {
        color: 'asc'
      },
      {
        size: 'asc'
      }
    ],
    select: {
      id: true,
      sku: true,
      color: true,
      size: true,
      price: true,
      stockQuantity: true,
      status: true,
      product: {
        select: {
          id: true,
          name: true,
          thumbnailUrl: true
        }
      }
    }
  });
},

  createAuditLog: async data => {
    return await prisma.auditLog.create({
      data
    });
  }
};

module.exports = inventoryRepository;