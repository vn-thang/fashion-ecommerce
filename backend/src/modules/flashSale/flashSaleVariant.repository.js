const prisma = require('../../config/database');

const flashSaleVariantRepository = {

  findByFlashSaleAndVariant: async (flashSaleId, productVariantId) => {
    return await prisma.flashSaleVariant.findUnique({
      where: {
        flashSaleId_productVariantId: {
          flashSaleId,
          productVariantId
        }
      }
    });
  },

  findById: async (id) => {
    return await prisma.flashSaleVariant.findUnique({
      where: {
        id
      },
      include: {
        flashSale: true,
        variant: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
                images: {
                  orderBy: {
                    displayOrder: 'asc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    });
  },

  findAllByFlashSale: async ({
    flashSaleId,
    skip,
    take
  }) => {

    const where = {
      flashSaleId
    };

    const [items, totalItems] = await prisma.$transaction([

      prisma.flashSaleVariant.findMany({
        where,

        skip,
        take,

        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                  images: {
                    orderBy: {
                      displayOrder: 'asc'
                    },
                    take: 1
                  }
                }
              }
            }
          }
        },

        orderBy: [
          {
            variant: {
              product: {
                name: 'asc'
              }
            }
          },
          {
            variant: {
              color: 'asc'
            }
          },
          {
            variant: {
              size: 'asc'
            }
          }
        ]
      }),

      prisma.flashSaleVariant.count({
        where
      })

    ]);

    return {
      flashSaleVariants: items,
      totalItems
    };
  },

  update: async (id, data) => {
    return await prisma.flashSaleVariant.update({
      where: {
        id
      },
      data
    });
  },

  delete: async (id) => {
    return await prisma.flashSaleVariant.delete({
      where: {
        id
      }
    });
  },

  findVariantById: async (id) => {
    return await prisma.productVariant.findUnique({
      where: {
        id
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            images: {
              orderBy: {
                displayOrder: 'asc'
              },
              take: 1
            }
          }
        }
      }
    });
  },

findAvailableVariants: async ({
  keyword,
  categoryIds,
  brandIds,
  flashSaleId,
  skip,
  take
}) => {
  const productWhere = {
    status: 'ACTIVE',

    ...(keyword && {
      name: {
        contains: keyword,
        mode: 'insensitive'
      }
    }),

    ...(categoryIds &&
      categoryIds.length > 0 && {
        categoryId: {
          in: categoryIds
        }
      }),

    ...(brandIds &&
      brandIds.length > 0 && {
        brandId: {
          in: brandIds
        }
      }),

    variants: {
      some: {
        status: 'ACTIVE',
        stockQuantity: {
          gt: 0
        },

        ...(flashSaleId && {
          flashSaleVariants: {
            none: {
              flashSaleId
            }
          }
        })
      }
    }
  };

  const [products, totalItems] = await prisma.$transaction([

    prisma.product.findMany({
      where: productWhere,

      skip,
      take,

      include: {
        brand: true,

        category: true,

        images: {
          orderBy: {
            displayOrder: 'asc'
          },
          take: 1
        },

        variants: {
          where: {
            status: 'ACTIVE',

            stockQuantity: {
              gt: 0
            },

            ...(flashSaleId && {
              flashSaleVariants: {
                none: {
                  flashSaleId
                }
              }
            })
          },

          orderBy: [
            {
              color: 'asc'
            },
            {
              size: 'asc'
            }
          ]
        }
      },

      orderBy: {
        name: 'asc'
      }
    }),

    prisma.product.count({
      where: productWhere
    })

  ]);

  return {
    products,
    totalItems
  };
},

createMany: async (variants) => {
  return await prisma.$transaction(
    variants.map(item =>
      prisma.flashSaleVariant.create({
        data: item
      })
    )
  );
},
findBasicById: async (id) => {
  return await prisma.flashSaleVariant.findUnique({
    where: { id }
  });
},
};

module.exports = flashSaleVariantRepository;