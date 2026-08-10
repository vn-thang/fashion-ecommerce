const couponRepository = require('./coupon.repository');
const { MESSAGES } = require('./coupon.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');

const couponService = {
  createCoupon: async (data) => {
    const code = data.code.toUpperCase().trim();
    const existing = await couponRepository.findByCode(code);
    if (existing) throw new Error(MESSAGES.CODE_EXISTED);
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new Error(MESSAGES.INVALID_DATE);
    }
    return await couponRepository.create({ ...data, code });
  },

 getAllCoupons: async (queryParams = {}, userId = null) => {
    const {
      search,
      discountType,
      status,
      fromDate,
      toDate,
      isActive,
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit
    );

    const { coupons, totalItems } =
      await couponRepository.findAllPaginated({
        search,
        discountType,
        status,
        fromDate,
        toDate,
        isActive,
        skip,
        take: limit,
        userId
      });

    let processedCoupons = coupons;

    if (userId) {
      processedCoupons = coupons.map(coupon => {
        const isUsed =
          coupon.usages?.length > 0;

        const { usages, ...restData } = coupon;

        return {
          ...restData,
          isUsed,
          isOutOfStock: restData.usageLimit <= 0
        };
      });
    }

    return {
      coupons: processedCoupons,
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  getCouponById: async id => {
    const coupon = await couponRepository.findById(id);

    if (!coupon) {
      throw new Error(MESSAGES.COUPON_NOT_FOUND);
    }

    return coupon;
  },

  getCouponByCode: async code => {
    const coupon = await couponRepository.findByCode(
      code.toUpperCase().trim()
    );

    if (!coupon) {
      throw new Error(MESSAGES.COUPON_NOT_FOUND);
    }

    return coupon;
  },

  updateCoupon: async (id, data) => {
    const currentCoupon = await couponRepository.findById(id);
    if (!currentCoupon) throw new Error(MESSAGES.COUPON_NOT_FOUND);

    const updateData = { ...data };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
      if (updateData.code !== currentCoupon.code) {
        const existing = await couponRepository.findByCode(updateData.code);
        if (existing) throw new Error(MESSAGES.CODE_EXISTED);
      }
    }

    const finalStartDate = updateData.startDate || currentCoupon.startDate;
    const finalEndDate = updateData.endDate || currentCoupon.endDate;
    if (new Date(finalStartDate) >= new Date(finalEndDate)) {
      throw new Error(MESSAGES.INVALID_DATE);
    }

    return await couponRepository.update(id, updateData);
  },

deactivateCoupon: async id => {
  const currentCoupon = await couponRepository.findById(id);

  if (!currentCoupon) {
    throw new Error(MESSAGES.COUPON_NOT_FOUND);
  }

  if (!currentCoupon.isActive) {
    throw new Error(MESSAGES.COUPON_ALREADY_INACTIVE);
  }

  return couponRepository.deactivate(id);
},
};

module.exports = couponService;