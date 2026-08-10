const flashSaleVariantRepository = require('./flashSaleVariant.repository');
const flashSaleRepository = require('./flashSale.repository');
const productRepository = require('../product/product.repository');

const { MESSAGES } = require('./flashSaleVariant.constant');
const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const flashSaleVariantService = {
  
  addVariants: async (flashSaleId, variants) => {
    const flashSale = await flashSaleRepository.findBasicById(flashSaleId);

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

      const variant = await flashSaleVariantRepository.findVariantById(productVariantId);

      if (!variant) {
        throw new Error(MESSAGES.VARIANT_NOT_FOUND);
      }

      const existed =
        await flashSaleVariantRepository.findByFlashSaleAndVariant(
          flashSaleId,
          productVariantId
        );

      if (existed) {
        throw new Error(
          `${variant.product.name} đã tồn tại trong Flash Sale`
        );
      }

      if (Number(flashSalePrice) >= Number(variant.price)) {
        throw new Error(
          `Giá Flash Sale của ${variant.product.name} phải nhỏ hơn giá gốc`
        );
      }

      if (flashSaleStock <= 0) {
        throw new Error(MESSAGES.INVALID_FLASHSALE_STOCK);
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

    return await flashSaleVariantRepository.createMany(data);
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

  update: async (id, body) => {
    const item =
      await flashSaleVariantRepository.findBasicById(id);

      const flashSale =
  await flashSaleRepository.findBasicById(item.flashSaleId);

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

    if (!item) {
      throw new Error(MESSAGES.FLASHSALE_VARIANT_NOT_FOUND);
    }

    const variant =
      await flashSaleVariantRepository.findVariantById(
        item.productVariantId
      );

    const data = {};

    if (body.flashSalePrice !== undefined) {
      if (Number(body.flashSalePrice) >= Number(variant.price)) {
        throw new Error(
          MESSAGES.FLASHSALE_PRICE_INVALID
        );
      }

      data.flashSalePrice = Number(body.flashSalePrice);
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

      data.flashSaleStock = Number(body.flashSaleStock);
    }

    return await flashSaleVariantRepository.update(
      id,
      data
    );
  },

  remove: async (id) => {
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

  return await flashSaleVariantRepository.delete(id);
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