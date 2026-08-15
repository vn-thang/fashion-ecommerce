const prisma = require('../../config/database');

const productRepository = {
findAllProductsAdminPaginated: async ({
  where,
  skip,
  take
}) => {
  const [products, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take
    }),

    prisma.product.count({
      where
    })
  ]);

  return {
    products,
    totalItems
  };
},

  findProductById: async (id) => {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true
      }
    });
  },

  findBySlug: async (slug) => {
    return await prisma.product.findUnique({ where: { slug } });
  },

  findVariantBySku: async (sku) => {
    return await prisma.productVariant.findUnique({ where: { sku } });
  },

  findVariantById: async (id) => {
  return await prisma.productVariant.findUnique({
    where: { id }
  });
},

findVariantBySku: async (sku) => {
  return await prisma.productVariant.findUnique({
    where: { sku }
  });
},

findProductsClient: async ({
  search,
  categoryId,
  brandId,
  color,
  size,
  minPrice,
  maxPrice,
  skip,
  take,
  sortBy
}) => {
  const where = {
    status: 'ACTIVE',
    brand: {
      status: 'ACTIVE'
    },
    category: {
      status: 'ACTIVE',
      OR: [
        { parentId: null },
        {
          parent: {
            status: 'ACTIVE',
            OR: [
              { parentId: null },
              {
                parent: {
                  status: 'ACTIVE'
                }
              }
            ]
          }
        }
      ]
    }
  };

  if (search) {
    const searchWords = search.trim().split(/\s+/);
    where.AND = searchWords.map(word => ({
      name: {
        contains: word,
        mode: 'insensitive'
      }
    }));
  }

  if (categoryId) {
    const categoryIds = categoryId
      .split(',')
      .map(id => id.trim());

    const relatedCategoryIds =
      await productRepository.getDescendantCategoryIds(
        categoryIds
      );

    where.categoryId = {
      in: relatedCategoryIds
    };
  }

  if (brandId) {
    where.brandId = {
      in: brandId
        .split(',')
        .map(id => id.trim())
    };
  }

  if (color || size || minPrice || maxPrice) {
    where.variants = {
      some: {
        status: 'ACTIVE',
        ...(color && {
          color: {
            equals: color,
            mode: 'insensitive'
          }
        }),
        ...(size && {
          size: {
            equals: size,
            mode: 'insensitive'
          }
        }),
        ...((minPrice || maxPrice) && {
          price: {
            ...(minPrice && {
              gte: Number(minPrice)
            }),
            ...(maxPrice && {
              lte: Number(maxPrice)
            })
          }
        })
      }
    };
  }

  let orderBy = { id: 'asc' };

  switch (sortBy) {
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'bestSeller':
      orderBy = { soldCount: 'desc' };
      break;
  }

  const [products, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        },
        variants: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            flashSaleVariants: {
              where: {
                flashSale: {
                  isActive: true,
                  startDate: {
                    lte: new Date()
                  },
                  endDate: {
                    gte: new Date()
                  }
                }
              },
              include: {
                flashSale: true
              }
            }
          }
        }
      },
      ...(skip !== undefined && { skip }),
      ...(take !== undefined && { take }),
      orderBy
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    totalItems
  };
},

findProductBySlugClient: async slug => {
  return await prisma.product.findFirst({
    where: {
      slug,
      status: 'ACTIVE',
      brand: {
        status: 'ACTIVE'
      },
      category: {
        status: 'ACTIVE',
        OR: [
          { parentId: null },
          {
            parent: {
              status: 'ACTIVE',
              OR: [
                { parentId: null },
                {
                  parent: {
                    status: 'ACTIVE'
                  }
                }
              ]
            }
          }
        ]
      }
    },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      variants: {
        where: {
          status: 'ACTIVE'
        },
        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    }
  });
},

findProductByIdClient: async id => {
  return await prisma.product.findFirst({
    where: {
      id,
      status: 'ACTIVE',
      brand: {
        status: 'ACTIVE'
      },
      category: {
        status: 'ACTIVE',
        OR: [
          { parentId: null },
          {
            parent: {
              status: 'ACTIVE',
              OR: [
                { parentId: null },
                {
                  parent: {
                    status: 'ACTIVE'
                  }
                }
              ]
            }
          }
        ]
      }
    },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      variants: {
        where: {
          status: 'ACTIVE'
        },
        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    }
  });
},
  // --- CREATE ---
  createProduct: async (data) => {
    return await prisma.product.create({ data });
  },

  createProductImages: async (imagesData) => {
    return await prisma.productImage.createMany({ data: imagesData });
  },

  createVariantWithInventory: async (variantData, transactionData) => {
    return await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.create({ data: variantData });
      
      if (transactionData.quantity > 0) {
        transactionData.productVariantId = variant.id;
        await tx.inventoryTransaction.create({ data: transactionData });
      }
      return variant;
    });
  },

  // --- UPDATE ---
  updateProduct: async (id, data) => {
    return await prisma.product.update({
      where: { id },
      data
    });
  },

  updateVariant: async (id, data) => {
    return await prisma.productVariant.update({
      where: { id },
      data
    });
  },

// --- DELETE / DEACTIVATE ---

deactivateProduct: async id => {
  return prisma.product.update({
    where: { id },
    data: {
      status: 'INACTIVE'
    }
  });
},

deactivateVariant: async id => {
  return prisma.productVariant.update({
    where: { id },
    data: {
      status: 'INACTIVE'
    }
  });
},

activateVariant: async id => {
  return await prisma.productVariant.update({
    where: { id },
    data: { status: 'ACTIVE' }
  });
},

findProductImageById: async (productId, imageId) => {
  return await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId
    }
  });
},

deleteProductImage: async (productId, imageId) => {
  return await prisma.productImage.delete({
    where: {
      id: imageId,
      productId
    }
  });
},
  
findRelatedProducts: async productId => {
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true }
  });

  if (!currentProduct) return [];

  const currentCategory = await prisma.category.findUnique({
    where: { id: currentProduct.categoryId }
  });

  if (!currentCategory) return [];

  let siblingCategoryIds = [];

  if (currentCategory.parentId) {
    const siblings = await prisma.category.findMany({
      where: {
        parentId: currentCategory.parentId,
        status: 'ACTIVE'
      },
      select: { id: true }
    });

    siblingCategoryIds = siblings.map(x => x.id);
  } else {
    siblingCategoryIds = [currentCategory.id];
  }

  return prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        status: 'ACTIVE'
      },
      brand: {
        status: 'ACTIVE'
      },
      id: {
        not: productId
      },
      categoryId: {
        in: siblingCategoryIds
      }
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      variants: {
        where: {
          status: 'ACTIVE'
        },
        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    },
    orderBy: [
      { categoryId: 'asc' },
      { reviewCount: 'desc' },
      { soldCount: 'desc' }
    ],
    take: 8
  });
},

getDescendantCategoryIds: async (parentIds) => {
  if (!Array.isArray(parentIds)) {
    parentIds = [parentIds];
  }

  const result = [...parentIds];

  const children = await prisma.category.findMany({
    where: {
      parentId: {
        in: parentIds
      }
    },
    select: {
      id: true
    }
  });

  if (children.length > 0) {
    const childIds = children.map(item => item.id);

    const descendants =
      await productRepository.getDescendantCategoryIds(childIds);

    result.push(...descendants);
  }

  return [...new Set(result)];
},
findAvailableVariants: async ({
  keyword,
  categoryIds,
  brandIds,
  flashSaleId,
  skip,
  take
}) => {

  const where = {
    status: 'ACTIVE',
    stockQuantity: {
      gt: 0
    },

    product: {
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
        })
    },

    ...(flashSaleId && {
      flashSaleVariants: {
        none: {
          flashSaleId
        }
      }
    })
  };

  const [variants, totalItems] = await prisma.$transaction([
    prisma.productVariant.findMany({
      where,
      skip,
      take,

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
      },

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
      ]
    }),

    prisma.productVariant.count({
      where
    })
  ]);

  return {
    variants,
    totalItems
  };
},

findBestSellingProducts: async (take = 10) => {
  return await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        status: 'ACTIVE'
      },
      brand: {
        status: 'ACTIVE'
      }
    },
    take,
    orderBy: [
      { soldCount: 'desc' },
      { rating: 'desc' },
      { createdAt: 'desc' }
    ],
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
          status: 'ACTIVE'
        },
        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    }
  });
},

findNewestProducts: async (take = 10) => {
  return await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        status: 'ACTIVE'
      },
      brand: {
        status: 'ACTIVE'
      }
    },
    take,
    orderBy: {
      createdAt: 'desc'
    },
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
          status: 'ACTIVE'
        },
        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    }
  });
},

findHighestRatedProducts: async (take = 10) => {
  return await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        status: 'ACTIVE'
      },
      brand: {
        status: 'ACTIVE'
      },
      reviewCount: {
        gt: 0 //3
      }
    },
    take,
    orderBy: [
      {
        rating: 'desc'
      },
      {
        reviewCount: 'desc'
      },
      {
        createdAt: 'desc'
      }
    ],
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
          status: 'ACTIVE'
        },

        include: {
          flashSaleVariants: {
            where: {
              flashSale: {
                isActive: true,
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              }
            },
            include: {
              flashSale: true
            }
          }
        }
      }
    }
  });
},

findSearchSuggestions: async (keyword, limit = 8) => {
  const search = keyword?.trim();

  if (!search) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',

      name: {
        contains: search,
        mode: 'insensitive'
      },

      brand: {
        status: 'ACTIVE'
      },

      category: {
        status: 'ACTIVE'
      }
    },

    select: {
      name: true
    },

    orderBy: {
      soldCount: 'desc'
    },

    take: limit
  });

  return products.map(product => product.name);
},
};

module.exports = productRepository;