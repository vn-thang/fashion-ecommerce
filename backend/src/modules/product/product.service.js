const productRepository = require('./product.repository');
const { STATUS, INVENTORY_TYPE, MESSAGES } = require('./product.constants');
const slugify = require('slugify');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');

const productService = {
 
  createProduct: async (body, file) => {
    const { categoryId, brandId, name, description, status } = body;
    const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await productRepository.findBySlug(slug);
    if (existingProduct) throw new Error(MESSAGES.SLUG_EXISTED);

    return await productRepository.createProduct({
      categoryId, brandId, name, slug, description,
      thumbnailUrl: file.path,
      status: status || STATUS.ACTIVE
    });
  },

  uploadAlbumImages: async (productId, files) => {
    const imagesData = files.map((file, index) => ({
      productId,
      imageUrl: file.path,
      displayOrder: index + 1
    }));
    return await productRepository.createProductImages(imagesData);
  },

  createVariant: async (productId, body, adminId) => {
    const { sku, color, size, price, stockQuantity, status } = body;

    const existingVariant = await productRepository.findVariantBySku(sku);
    if (existingVariant) throw new Error(MESSAGES.SKU_EXISTED);

    const variantData = {
      productId, sku, color, size,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      status: status || STATUS.ACTIVE
    };

    const transactionData = {
      type: INVENTORY_TYPE.IMPORT,
      quantity: parseInt(stockQuantity),
      note: `Khởi tạo số lượng tồn kho ban đầu cho biến thể SKU: ${sku}`,
      createdBy: adminId
    };

    return await productRepository.createVariantWithInventory(variantData, transactionData);
  },

getAllProducts: async queryParams => {
  const { page, limit, skip } = getPagination(
    queryParams.page,
    queryParams.limit
  );

  const where = {};
  if (queryParams.keyword?.trim()) {
    where.OR = [
      {
        name: {
          contains: queryParams.keyword.trim(),
          mode: 'insensitive'
        }
      },
      {
        variants: {
          some: {
            sku: {
              contains: queryParams.keyword.trim(),
              mode: 'insensitive'
            }
          }
        }
      }
    ];
  }

  if (queryParams.categoryId) {
    const categoryIds =
      await productRepository.getDescendantCategoryIds(
        queryParams.categoryId
      );

    where.categoryId = {
      in: categoryIds
    };
  }

  if (queryParams.brandId) {
    where.brandId = queryParams.brandId;
  }

  if (queryParams.status) {
    where.status = queryParams.status;
  }

  const { products, totalItems } =
    await productRepository.findAllProductsAdminPaginated({
      where,
      skip,
      take: limit
    });

  return {
    products,
    pagination: getPaginationMetadata(
      totalItems,
      page,
      limit
    )
  };
},

getProductById: async id => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm!');
  }

  return {
    ...product,
    rating: Number(product.rating || 0),
    variants: product.variants.map(variant => ({
      ...variant,
      price: Number(variant.price),
      stockQuantity: Number(variant.stockQuantity || 0)
    }))
  };
},

  updateProduct: async (id, body, file) => {
    const { name, categoryId, brandId, description, status } = body;
    const dataToUpdate = { categoryId, brandId, description, status };

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const existing = await productRepository.findBySlug(slug);
      if (existing && existing.id !== id) throw new Error(MESSAGES.SLUG_EXISTED);
      
      dataToUpdate.name = name;
      dataToUpdate.slug = slug;
    }

    if (file) {
      dataToUpdate.thumbnailUrl = file.path;
    }

    return await productRepository.updateProduct(id, dataToUpdate);
  },

  updateVariant: async (variantId, body) => {
    const { sku, color, size, price, status } = body;
    const dataToUpdate = { color, size, status };

    if (sku) {
      const existing = await productRepository.findVariantBySku(sku);
      if (existing && existing.id !== variantId) throw new Error(MESSAGES.SKU_EXISTED);
      dataToUpdate.sku = sku;
    }
    if (price) dataToUpdate.price = parseFloat(price);
    return await productRepository.updateVariant(variantId, dataToUpdate);
  },

deleteProduct: async id => {
  return productRepository.deactivateProduct(id);
},

deleteVariant: async id => {
  return productRepository.deactivateVariant(id);
},

activateVariant: async variantId => {
  const variant = await productRepository.findVariantById(variantId);

  if (!variant) {
    throw new Error(MESSAGES.VARIANT_NOT_FOUND);
  }

  if (variant.status === 'ACTIVE') {
    throw new Error('Phân loại đang hoạt động.');
  }

  return await productRepository.activateVariant(variantId);
},

deleteProductImage: async (productId, imageId) => {
  const image = await productRepository.findProductImageById(
    productId,
    imageId
  );

  if (!image) {
    throw new Error(MESSAGES.PRODUCT_IMAGE_NOT_FOUND);
  }

  return productRepository.deleteProductImage(
    productId,
    imageId
  );
},

getProductsClient: async queryParams => {
  const {
    search,
    categoryId,
    brandId,
    color,
    size,
    minPrice,
    maxPrice,
    sortBy
  } = queryParams;

  const { page, limit, skip } = getPagination(
    queryParams.page,
    queryParams.limit
  );

  const isPriceSort =
    sortBy === 'price_asc' ||
    sortBy === 'price_desc';

  const { products, totalItems } =
    await productRepository.findProductsClient({
      search,
      categoryId,
      brandId,
      color,
      size,
      minPrice,
      maxPrice,
      skip: isPriceSort ? undefined : skip,
      take: isPriceSort ? undefined : limit,
      sortBy
    });

  const processedProducts = products.map(product => {
    const variantPrices = product.variants.map(variant => {
      const flash = variant.flashSaleVariants?.[0];

      return {
        originalPrice: Number(variant.price),
        displayPrice: flash
          ? Number(flash.flashSalePrice)
          : Number(variant.price),
        isFlashSale: !!flash
      };
    });

    const originalPrices = variantPrices.map(
      variant => variant.originalPrice
    );

    const displayPrices = variantPrices.map(
      variant => variant.displayPrice
    );

    return {
      ...product,
      rating: Number(product.rating || 0),
      minPrice: displayPrices.length
        ? Math.min(...displayPrices)
        : null,
      maxPrice: displayPrices.length
        ? Math.max(...displayPrices)
        : null,
      minOriginalPrice: originalPrices.length
        ? Math.min(...originalPrices)
        : null,
      maxOriginalPrice: originalPrices.length
        ? Math.max(...originalPrices)
        : null,
      isFlashSale: variantPrices.some(
        variant => variant.isFlashSale
      )
    };
  });

  if (sortBy === 'price_asc') {
    processedProducts.sort(
      (a, b) =>
        (a.minPrice ?? Infinity) -
        (b.minPrice ?? Infinity)
    );
  }

  if (sortBy === 'price_desc') {
    processedProducts.sort(
      (a, b) =>
        (b.maxPrice ?? -Infinity) -
        (a.maxPrice ?? -Infinity)
    );
  }

  let finalProducts = processedProducts;
  let finalTotalItems = totalItems;

  if (isPriceSort) {
    finalTotalItems = processedProducts.length;
    finalProducts = processedProducts.slice(
      skip,
      skip + limit
    );
  }

  return {
    products: finalProducts,
    pagination: getPaginationMetadata(
      finalTotalItems,
      page,
      limit
    )
  };
},

getProductBySlugClient: async slug => {
  const product =
    await productRepository.findProductBySlugClient(slug);

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm!');
  }

  return {
    ...product,
    rating: Number(product.rating || 0),
    variants: product.variants.map(variant => {
      const flash = variant.flashSaleVariants?.[0];

      return {
        ...variant,
        price: Number(variant.price),
        originalPrice: Number(variant.price),
        flashSalePrice: flash
          ? Number(flash.flashSalePrice)
          : null,
        flashSaleStock:
          flash?.flashSaleStock ?? null,
        soldCount: flash?.soldCount ?? 0,
        flashSaleVariantId: flash?.id ?? null,
        discountPercent: flash
          ? Math.round(
              ((Number(variant.price) -
                Number(flash.flashSalePrice)) /
                Number(variant.price)) *
                100
            )
          : 0,
        isFlashSale: !!flash
      };
    })
  };
},

getProductByIdClient: async id => {
  const product =
    await productRepository.findProductByIdClient(id);

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm!');
  }

  return {
    ...product,
    rating: Number(product.rating || 0),
    variants: product.variants.map(variant => {
      const flash = variant.flashSaleVariants?.[0];

      return {
        ...variant,
        price: Number(variant.price),
        originalPrice: Number(variant.price),
        flashSalePrice: flash
          ? Number(flash.flashSalePrice)
          : null,
        flashSaleStock:
          flash?.flashSaleStock ?? null,
        soldCount: flash?.soldCount ?? 0,
        flashSaleVariantId: flash?.id ?? null,
        discountPercent: flash
          ? Math.round(
              ((Number(variant.price) -
                Number(flash.flashSalePrice)) /
                Number(variant.price)) *
                100
            )
          : 0,
        isFlashSale: !!flash
      };
    })
  };
},

getRelatedProducts: async (productId) => {

  const products =
    await productRepository.findRelatedProducts(productId);

  return {

    products: products.map(product => {

      const variantPrices = product.variants.map(v => {

        const flash = v.flashSaleVariants?.[0];

        return {

          originalPrice: Number(v.price),

          displayPrice: flash
            ? Number(flash.flashSalePrice)
            : Number(v.price),

          isFlashSale: !!flash
        };
      });

      const originalPrices =
        variantPrices.map(v => v.originalPrice);

      const displayPrices =
        variantPrices.map(v => v.displayPrice);

      return {

        ...product,

        rating: Number(product.rating || 0),

        minPrice:
          displayPrices.length
            ? Math.min(...displayPrices)
            : null,

        maxPrice:
          displayPrices.length
            ? Math.max(...displayPrices)
            : null,

        minOriginalPrice:
          originalPrices.length
            ? Math.min(...originalPrices)
            : null,

        maxOriginalPrice:
          originalPrices.length
            ? Math.max(...originalPrices)
            : null,

        isFlashSale:
          variantPrices.some(v => v.isFlashSale)
      };
    })
  };
},

getBestSellingProducts: async () => {
  const products =
    await productRepository.findBestSellingProducts(10);

  return {
    products: products.map(product => {

      const variants = product.variants.map(variant => {

        const flash =
          variant.flashSaleVariants?.[0];

        return {
          originalPrice: Number(variant.price),

          displayPrice: flash
            ? Number(flash.flashSalePrice)
            : Number(variant.price),

          flashSalePrice: flash
            ? Number(flash.flashSalePrice)
            : null,

          discountPercent: flash
            ? Math.round(
                ((Number(variant.price) -
                  Number(flash.flashSalePrice)) /
                  Number(variant.price)) *
                  100
              )
            : 0,

          isFlashSale: !!flash
        };
      });

      const originalPrices = variants.map(
        x => x.originalPrice
      );

      const displayPrices = variants.map(
        x => x.displayPrice
      );

      const flashVariants = variants.filter(
        x => x.isFlashSale
      );

      return {

        id: product.id,

        name: product.name,

        slug: product.slug,

        thumbnailUrl:
          product.thumbnailUrl ||
          product.images?.[0]?.imageUrl ||
          null,

        brand: product.brand,

        category: product.category,

        rating: Number(product.rating),

        soldCount: product.soldCount,

        reviewCount: product.reviewCount,

        minPrice:
          displayPrices.length
            ? Math.min(...displayPrices)
            : null,

        maxPrice:
          displayPrices.length
            ? Math.max(...displayPrices)
            : null,

        minOriginalPrice:
          originalPrices.length
            ? Math.min(...originalPrices)
            : null,

        maxOriginalPrice:
          originalPrices.length
            ? Math.max(...originalPrices)
            : null,

        isFlashSale:
          flashVariants.length > 0,

        flashSale:
          flashVariants.length > 0
            ? {
                minFlashPrice: Math.min(
                  ...flashVariants.map(
                    x => x.flashSalePrice
                  )
                ),

                maxFlashPrice: Math.max(
                  ...flashVariants.map(
                    x => x.flashSalePrice
                  )
                ),

                minOriginalPrice: Math.min(
                  ...flashVariants.map(
                    x => x.originalPrice
                  )
                ),

                maxOriginalPrice: Math.max(
                  ...flashVariants.map(
                    x => x.originalPrice
                  )
                ),

                maxDiscountPercent: Math.max(
                  ...flashVariants.map(
                    x => x.discountPercent
                  )
                )
              }
            : null
      };
    })
  };
},
getNewestProducts: async () => {
  const products =
    await productRepository.findNewestProducts(10);

  return {
    products: products.map(product => {

      const variants = product.variants.map(variant => {

        const flash =
          variant.flashSaleVariants?.[0];

        return {
          originalPrice: Number(variant.price),

          displayPrice: flash
            ? Number(flash.flashSalePrice)
            : Number(variant.price),

          flashSalePrice: flash
            ? Number(flash.flashSalePrice)
            : null,

          discountPercent: flash
            ? Math.round(
                ((Number(variant.price) -
                  Number(flash.flashSalePrice)) /
                  Number(variant.price)) *
                  100
              )
            : 0,

          isFlashSale: !!flash
        };
      });

      const originalPrices = variants.map(
        x => x.originalPrice
      );

      const displayPrices = variants.map(
        x => x.displayPrice
      );

      const flashVariants = variants.filter(
        x => x.isFlashSale
      );

      return {
        id: product.id,

        name: product.name,

        slug: product.slug,

        thumbnailUrl:
          product.thumbnailUrl ||
          product.images?.[0]?.imageUrl ||
          null,

        brand: product.brand,

        category: product.category,

        rating: Number(product.rating),

        soldCount: product.soldCount,

        reviewCount: product.reviewCount,

        minPrice:
          displayPrices.length
            ? Math.min(...displayPrices)
            : null,

        maxPrice:
          displayPrices.length
            ? Math.max(...displayPrices)
            : null,

        minOriginalPrice:
          originalPrices.length
            ? Math.min(...originalPrices)
            : null,

        maxOriginalPrice:
          originalPrices.length
            ? Math.max(...originalPrices)
            : null,

        isFlashSale:
          flashVariants.length > 0,

        flashSale:
          flashVariants.length > 0
            ? {
                minFlashPrice: Math.min(
                  ...flashVariants.map(
                    x => x.flashSalePrice
                  )
                ),

                maxFlashPrice: Math.max(
                  ...flashVariants.map(
                    x => x.flashSalePrice
                  )
                ),

                minOriginalPrice: Math.min(
                  ...flashVariants.map(
                    x => x.originalPrice
                  )
                ),

                maxOriginalPrice: Math.max(
                  ...flashVariants.map(
                    x => x.originalPrice
                  )
                ),

                maxDiscountPercent: Math.max(
                  ...flashVariants.map(
                    x => x.discountPercent
                  )
                )
              }
            : null
      };
    })
  };
},
};

module.exports = productService;