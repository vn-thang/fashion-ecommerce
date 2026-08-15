const couponRepository = require('./coupon.repository');
const { MESSAGES } = require('./coupon.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');
const auditLogService = require('../auditLog/auditLog.service');

const couponService = {
 createCoupon: async (data, adminId) => {
    const code = data.code.toUpperCase().trim();

    const existing = await couponRepository.findByCode(code);

    if (existing) {
      throw new Error(MESSAGES.CODE_EXISTED);
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new Error(MESSAGES.INVALID_DATE);
    }

    const coupon = await couponRepository.create({
      ...data,
      code
    });

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'CREATE',
      entityName: 'Coupon',
      entityId: coupon.id,
      oldValues: null,
      newValues: coupon
    });

    return coupon;
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

    updateCoupon: async (id, data, adminId) => {
    const currentCoupon =
      await couponRepository.findById(id);

    if (!currentCoupon) {
      throw new Error(MESSAGES.COUPON_NOT_FOUND);
    }

    const updateData = { ...data };

    if (updateData.code) {
      updateData.code =
        updateData.code.toUpperCase().trim();

      if (updateData.code !== currentCoupon.code) {
        const existing =
          await couponRepository.findByCode(updateData.code);

        if (existing) {
          throw new Error(MESSAGES.CODE_EXISTED);
        }
      }
    }

    const finalStartDate =
      updateData.startDate || currentCoupon.startDate;

    const finalEndDate =
      updateData.endDate || currentCoupon.endDate;

    if (
      new Date(finalStartDate) >=
      new Date(finalEndDate)
    ) {
      throw new Error(MESSAGES.INVALID_DATE);
    }

    const updatedCoupon =
      await couponRepository.update(id, updateData);

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'UPDATE',
      entityName: 'Coupon',
      entityId: id,
      oldValues: currentCoupon,
      newValues: updatedCoupon
    });

    return updatedCoupon;
  },

  deactivateCoupon: async (id, adminId) => {
    const currentCoupon =
      await couponRepository.findById(id);

    if (!currentCoupon) {
      throw new Error(MESSAGES.COUPON_NOT_FOUND);
    }

    if (!currentCoupon.isActive) {
      throw new Error(
        MESSAGES.COUPON_ALREADY_INACTIVE
      );
    }

    const updatedCoupon =
      await couponRepository.deactivate(id);

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'DEACTIVATE',
      entityName: 'Coupon',
      entityId: id,
      oldValues: {
        isActive: currentCoupon.isActive
      },
      newValues: {
        isActive: updatedCoupon.isActive
      }
    });

    return updatedCoupon;
  }
};

module.exports = couponService;