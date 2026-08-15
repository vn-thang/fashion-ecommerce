const flashSaleVariantRepository = require('./flashSaleVariant.repository');
const flashSaleRepository = require('./flashSale.repository');
const productRepository = require('../product/product.repository');
const auditLogService = require('../auditLog/auditLog.service');

const { MESSAGES } = require('./flashSaleVariant.constant');
const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const flashSaleVariantService = {
  
  addVariants: async (flashSaleId, variants, adminId) => {
  const flashSale =
    await flashSaleRepository.findBasicById(flashSaleId);

  if (!flashSale) {
    throw new Error(MESSAGES.FLASH_SALE_NOT_FOUND);
  }

  const now = new Date();

  if (flashSale.endDate <= now) {
    throw new Error(
      'Flash Sale đã kết thúc, không thể thêm sản phẩm.'
    );
  }

  if (
    flashSale.isActive &&
    flashSale.startDate <= now &&
    flashSale.endDate >= now
  ) {
    throw new Error(
      'Flash Sale đang diễn ra, không thể thêm sản phẩm.'
    );
  }

  const data = [];

  for (const item of variants) {
    const {
      productVariantId,
      flashSalePrice,
      flashSaleStock
    } = item;

    const variant =
      await flashSaleVariantRepository.findVariantById(
        productVariantId
      );

    if (!variant) {
      throw new Error(MESSAGES.VARIANT_NOT_FOUND);
    }

    const existed =
      await flashSaleVariantRepository
        .findByFlashSaleAndVariant(
          flashSaleId,
          productVariantId
        );

    if (existed) {
      throw new Error(
        `${variant.product.name} đã tồn tại trong Flash Sale`
      );
    }

    if (
      Number(flashSalePrice) >=
      Number(variant.price)
    ) {
      throw new Error(
        `Giá Flash Sale của ${variant.product.name} phải nhỏ hơn giá gốc`
      );
    }

    if (flashSaleStock <= 0) {
      throw new Error(
        MESSAGES.INVALID_FLASHSALE_STOCK
      );
    }

    if (flashSaleStock > variant.stockQuantity) {
      throw new Error(
        `Flash Sale Stock của ${variant.product.name} vượt quá tồn kho`
      );
    }

    data.push({
      flashSaleId,
      productVariantId,
      flashSalePrice: Number(flashSalePrice),
      flashSaleStock: Number(flashSaleStock)
    });
  }

  const result =
    await flashSaleVariantRepository.createMany(data);

  await auditLogService.createAuditLog({
    userId: adminId,
    action: 'ADD_VARIANTS',
    entityName: 'FlashSale',
    entityId: flashSaleId,
    oldValues: null,
    newValues: {
      variants: data
    }
  });

  return result;
},

  getFlashSaleVariants: async (flashSaleId, query) => {
    const flashSale = await flashSaleRepository.findBasicById(flashSaleId);

    if (!flashSale) {
      throw new Error(MESSAGES.FLASH_SALE_NOT_FOUND);
    }

    const { page, limit, skip } = getPagination(
      query.page,
      query.limit
    );

    const { flashSaleVariants, totalItems } =
      await flashSaleVariantRepository.findAllByFlashSale({
        flashSaleId,
        skip,
        take: limit
      });

    return {
      flashSaleVariants,
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  getById: async (id) => {
    const item =
      await flashSaleVariantRepository.findById(id);

    if (!item) {
      throw new Error(MESSAGES.FLASHSALE_VARIANT_NOT_FOUND);
    }

    return item;
  },

  update: async (id, body, adminId) => {
  const item =
    await flashSaleVariantRepository.findBasicById(id);

  if (!item) {
    throw new Error(
      MESSAGES.FLASHSALE_VARIANT_NOT_FOUND
    );
  }

  const flashSale =
    await flashSaleRepository.findBasicById(
      item.flashSaleId
    );

  const now = new Date();

  if (flashSale.endDate <= now) {
    throw new Error(
      'Flash Sale đã kết thúc, không thể chỉnh sửa.'
    );
  }

  if (
    flashSale.isActive &&
    flashSale.startDate <= now &&
    flashSale.endDate >= now
  ) {
    throw new Error(
      'Flash Sale đang diễn ra, không thể chỉnh sửa.'
    );
  }

  const variant =
    await flashSaleVariantRepository.findVariantById(
      item.productVariantId
    );

  const data = {};

  if (body.flashSalePrice !== undefined) {
    if (
      Number(body.flashSalePrice) >=
      Number(variant.price)
    ) {
      throw new Error(
        MESSAGES.FLASHSALE_PRICE_INVALID
      );
    }

    data.flashSalePrice =
      Number(body.flashSalePrice);
  }

  if (body.flashSaleStock !== undefined) {
    if (Number(body.flashSaleStock) <= 0) {
      throw new Error(
        MESSAGES.INVALID_FLASHSALE_STOCK
      );
    }

    if (
      Number(body.flashSaleStock) >
      variant.stockQuantity
    ) {
      throw new Error(
        MESSAGES.FLASHSALE_STOCK_EXCEED
      );
    }

    data.flashSaleStock =
      Number(body.flashSaleStock);
  }

  const updated =
    await flashSaleVariantRepository.update(
      id,
      data
    );

  await auditLogService.createAuditLog({
    userId: adminId,
    action: 'UPDATE',
    entityName: 'FlashSaleVariant',
    entityId: id,
    oldValues: {
      flashSalePrice: item.flashSalePrice,
      flashSaleStock: item.flashSaleStock
    },
    newValues: {
      flashSalePrice: updated.flashSalePrice,
      flashSaleStock: updated.flashSaleStock
    }
  });

  return updated;
},

  remove: async (id, adminId) => {
  const item =
    await flashSaleVariantRepository.findBasicById(id);

  if (!item) {
    throw new Error(
      MESSAGES.FLASHSALE_VARIANT_NOT_FOUND
    );
  }

  const flashSale =
    await flashSaleRepository.findBasicById(
      item.flashSaleId
    );

  const now = new Date();

  if (flashSale.endDate <= now) {
    throw new Error(
      'Flash Sale đã kết thúc, không thể xóa sản phẩm.'
    );
  }

  if (
    flashSale.isActive &&
    flashSale.startDate <= now &&
    flashSale.endDate >= now
  ) {
    throw new Error(
      'Flash Sale đang diễn ra, không thể xóa sản phẩm.'
    );
  }

  const result =
    await flashSaleVariantRepository.delete(id);

  await auditLogService.createAuditLog({
    userId: adminId,
    action: 'REMOVE',
    entityName: 'FlashSaleVariant',
    entityId: id,
    oldValues: {
      flashSaleId: item.flashSaleId,
      productVariantId: item.productVariantId,
      flashSalePrice: item.flashSalePrice,
      flashSaleStock: item.flashSaleStock
    },
    newValues: null
  });

  return result;
},

getAvailableVariants: async (
  flashSaleId,
  query
) => {
  const {
    keyword,
    categoryId,
    brandId
  } = query;

  const { page, limit, skip } = getPagination(
    query.page,
    query.limit
  );

  let categoryIds = [];

  if (categoryId) {
    categoryIds =
      await productRepository.getDescendantCategoryIds(
        categoryId
      );
  }

  const brandIds = brandId
    ? brandId.split(',')
    : [];

  const { products, totalItems } =
    await flashSaleVariantRepository.findAvailableVariants({
      keyword,
      categoryIds,
      brandIds,
      flashSaleId,
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
};

module.exports = flashSaleVariantService;