const flashSaleRepository = require('./flashSale.repository');
const { MESSAGES } = require('./flashSale.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');
const auditLogService = require('../auditLog/auditLog.service');

const flashSaleService = {
 createFlashSale: async (
    { name, startDate, endDate, isActive = true },
    adminId
  ) => {
    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error(MESSAGES.INVALID_DATE);
    }

    const existedName =
      await flashSaleRepository.findByName(name);

    if (existedName) {
      throw new Error(
        'Tên chương trình Flash Sale đã tồn tại.'
      );
    }

    const overlap =
      await flashSaleRepository.findOverlap(
        startDate,
        endDate
      );

    if (overlap) {
      throw new Error(
        MESSAGES.FLASH_SALE_OVERLAP
      );
    }

    const flashSale =
      await flashSaleRepository.create({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive
      });

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'CREATE',
      entityName: 'FlashSale',
      entityId: flashSale.id,
      oldValues: null,
      newValues: flashSale
    });

    return flashSale;
  },


  getAllFlashSales: async (queryParams = {}) => {
    const { search, page: rawPage, limit: rawLimit } = queryParams;
    const { page, limit, skip } = getPagination(rawPage, rawLimit);

    const { flashSales, totalItems } = await flashSaleRepository.findAllPaginated({
      search,
      skip,
      take: limit
    });

    const now = new Date();

    const result = flashSales.map(item => {
      let status = 'Sắp diễn ra';

      if (!item.isActive) status = 'Đã tắt';
      else if (item.startDate <= now && item.endDate >= now) status = 'Đang diễn ra';
      else if (item.endDate < now) status = 'Đã kết thúc';

      return { ...item, status };
    });

    return {
      flashSales: result,
      pagination: getPaginationMetadata(totalItems, page, limit)
    };
  },

  getFlashSaleById: async (id) => {
    const flashSale = await flashSaleRepository.findById(id);

    if (!flashSale) {
      throw new Error(MESSAGES.FLASH_SALE_NOT_FOUND);
    }

    return flashSale;
  },
  updateFlashSale: async (
    id,
    { name, startDate, endDate, isActive },
    adminId
  ) => {
    const existing =
      await flashSaleRepository.findBasicById(id);

    if (!existing) {
      throw new Error(
        MESSAGES.FLASH_SALE_NOT_FOUND
      );
    }

    const now = new Date();

    if (existing.endDate < now) {
      throw new Error(
        'Flash Sale đã kết thúc, không thể chỉnh sửa.'
      );
    }

    if (
      existing.isActive &&
      existing.startDate <= now &&
      existing.endDate >= now
    ) {
      throw new Error(
        'Không thể chỉnh sửa Flash Sale đang diễn ra.'
      );
    }

    const data = {};

    if (name !== undefined) {
      const duplicated =
        await flashSaleRepository.findByName(
          name,
          id
        );

      if (duplicated) {
        throw new Error(
          'Tên chương trình Flash Sale đã tồn tại.'
        );
      }

      data.name = name;
    }

    const newStartDate =
      startDate ?? existing.startDate;

    const newEndDate =
      endDate ?? existing.endDate;

    if (
      new Date(newEndDate) <=
      new Date(newStartDate)
    ) {
      throw new Error(
        MESSAGES.INVALID_DATE
      );
    }

    const overlap =
      await flashSaleRepository.findOverlap(
        newStartDate,
        newEndDate,
        id
      );

    if (overlap) {
      throw new Error(
        MESSAGES.FLASH_SALE_OVERLAP
      );
    }

    if (startDate !== undefined) {
      data.startDate = new Date(startDate);
    }

    if (endDate !== undefined) {
      data.endDate = new Date(endDate);
    }

    if (isActive !== undefined) {
      data.isActive = isActive;
    }

    const updatedFlashSale =
      await flashSaleRepository.update(
        id,
        data
      );

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'UPDATE',
      entityName: 'FlashSale',
      entityId: id,
      oldValues: existing,
      newValues: updatedFlashSale
    });

    return updatedFlashSale;
  },

 disableFlashSale: async (id, adminId) => {
    const existing =
      await flashSaleRepository.findBasicById(id);

    if (!existing) {
      throw new Error(
        MESSAGES.FLASH_SALE_NOT_FOUND
      );
    }

    const flashSale =
      await flashSaleRepository.disable(id);

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'DEACTIVATE',
      entityName: 'FlashSale',
      entityId: id,
      oldValues: {
        isActive: existing.isActive
      },
      newValues: {
        isActive: flashSale.isActive
      }
    });

    return flashSale;
  },
  
  getActiveFlashSale: async () => {
  const flashSale = await flashSaleRepository.findActiveFlashSale();

  if (!flashSale) {
    return null;
  }

  const productMap = new Map();

  flashSale.flashSaleVariants.forEach((item) => {
    const product = item.variant.product;

    if (!productMap.has(product.id)) {
      productMap.set(product.id, {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,

        brand: product.brand,
        category: product.category,
        thumbnailUrl: product.thumbnailUrl,

        minFlashPrice: Number(item.flashSalePrice),
        maxFlashPrice: Number(item.flashSalePrice),

        minOriginalPrice: Number(item.variant.price),
        maxOriginalPrice: Number(item.variant.price),

        flashSaleStock: item.flashSaleStock,
        soldCount: item.soldCount,

        variants: [
          {
            flashSaleVariantId: item.id,

            variantId: item.variant.id,
            sku: item.variant.sku,

            color: item.variant.color,
            size: item.variant.size,

            originalPrice: Number(item.variant.price),
            flashSalePrice: Number(item.flashSalePrice),

            flashSaleStock: item.flashSaleStock,
            soldCount: item.soldCount
          }
        ]
      });

      return;
    }

    const existing = productMap.get(product.id);

    existing.minFlashPrice = Math.min(
      existing.minFlashPrice,
      Number(item.flashSalePrice)
    );

    existing.maxFlashPrice = Math.max(
      existing.maxFlashPrice,
      Number(item.flashSalePrice)
    );

    existing.minOriginalPrice = Math.min(
      existing.minOriginalPrice,
      Number(item.variant.price)
    );

    existing.maxOriginalPrice = Math.max(
      existing.maxOriginalPrice,
      Number(item.variant.price)
    );

    existing.flashSaleStock += item.flashSaleStock;

    existing.soldCount += item.soldCount;

    existing.variants.push({
      flashSaleVariantId: item.id,

      variantId: item.variant.id,
      sku: item.variant.sku,

      color: item.variant.color,
      size: item.variant.size,

      originalPrice: Number(item.variant.price),
      flashSalePrice: Number(item.flashSalePrice),

      flashSaleStock: item.flashSaleStock,
      soldCount: item.soldCount
    });
  });

  return {
    id: flashSale.id,
    name: flashSale.name,
    startDate: flashSale.startDate,
    endDate: flashSale.endDate,

    products: Array.from(productMap.values())
  };
},
getCustomerFlashSale: async (queryParams = {}) => {
  const {
    page: rawPage,
    limit: rawLimit,
    sortBy = 'latest'
  } = queryParams;

  const { page, limit } = getPagination(rawPage, rawLimit);

  const flashSale = await flashSaleRepository.findActiveFlashSale();

  if (!flashSale) {
    return {
      flashSale: null,
      products: [],
      pagination: getPaginationMetadata(0, page, limit)
    };
  }

  const productMap = new Map();

  flashSale.flashSaleVariants.forEach((item) => {
    const product = item.variant.product;

    if (!productMap.has(product.id)) {
      productMap.set(product.id, {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,

        thumbnailUrl:
          product.thumbnailUrl ||
          product.images?.[0]?.imageUrl ||
          null,

        brand: product.brand,
        category: product.category,

        minOriginalPrice: Number(item.variant.price),
        maxOriginalPrice: Number(item.variant.price),

        minFlashPrice: Number(item.flashSalePrice),
        maxFlashPrice: Number(item.flashSalePrice),

        flashSaleStock: item.flashSaleStock,
        soldCount: item.soldCount,

        createdAt: item.createdAt,

        variants: [
          {
            flashSaleVariantId: item.id,
            variantId: item.variant.id,
            sku: item.variant.sku,
            color: item.variant.color,
            size: item.variant.size,

            originalPrice: Number(item.variant.price),
            flashSalePrice: Number(item.flashSalePrice),

            flashSaleStock: item.flashSaleStock,
            soldCount: item.soldCount
          }
        ]
      });

      return;
    }

    const existing = productMap.get(product.id);

    existing.minOriginalPrice = Math.min(
      existing.minOriginalPrice,
      Number(item.variant.price)
    );

    existing.maxOriginalPrice = Math.max(
      existing.maxOriginalPrice,
      Number(item.variant.price)
    );

    existing.minFlashPrice = Math.min(
      existing.minFlashPrice,
      Number(item.flashSalePrice)
    );

    existing.maxFlashPrice = Math.max(
      existing.maxFlashPrice,
      Number(item.flashSalePrice)
    );

    existing.flashSaleStock += item.flashSaleStock;

    existing.soldCount += item.soldCount;

    if (new Date(item.createdAt) > new Date(existing.createdAt)) {
      existing.createdAt = item.createdAt;
    }

    existing.variants.push({
      flashSaleVariantId: item.id,
      variantId: item.variant.id,
      sku: item.variant.sku,
      color: item.variant.color,
      size: item.variant.size,

      originalPrice: Number(item.variant.price),
      flashSalePrice: Number(item.flashSalePrice),

      flashSaleStock: item.flashSaleStock,
      soldCount: item.soldCount
    });
  });

  let products = Array.from(productMap.values());

  switch (sortBy) {
    case 'priceAsc':
      products.sort(
        (a, b) => a.minFlashPrice - b.minFlashPrice
      );
      break;

    case 'priceDesc':
      products.sort(
        (a, b) => b.minFlashPrice - a.minFlashPrice
      );
      break;

    case 'discount':
      products.sort((a, b) => {
        const discountA =
          ((a.minOriginalPrice - a.minFlashPrice) /
            a.minOriginalPrice) *
          100;

        const discountB =
          ((b.minOriginalPrice - b.minFlashPrice) /
            b.minOriginalPrice) *
          100;

        return discountB - discountA;
      });
      break;

    case 'bestSelling':
      products.sort(
        (a, b) => b.soldCount - a.soldCount
      );
      break;

    case 'latest':
    default:
      products.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
      break;
  }

  const totalItems = products.length;

  const startIndex = (page - 1) * limit;

  const paginatedProducts = products.slice(
    startIndex,
    startIndex + limit
  );

  return {
    flashSale: {
      id: flashSale.id,
      name: flashSale.name,
      startDate: flashSale.startDate,
      endDate: flashSale.endDate
    },

    products: paginatedProducts,

    pagination: getPaginationMetadata(
      totalItems,
      page,
      limit
    )
  };
},
};

module.exports = flashSaleService;