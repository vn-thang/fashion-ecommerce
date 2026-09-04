const couponRepository = require('./coupon.repository');
const { MESSAGES } = require('./coupon.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');
const auditLogService = require('../auditLog/auditLog.service');
const notificationService = require('../notification/notification.service');
const NOTIFICATION_CONSTANTS = require('../notification/notification.constants');

const { formatCurrency, formatDiscount } = require('./coupon.utils');

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

getAllCoupons: async (
  queryParams = {},
  userId = null
) => {
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

  const {
    page,
    limit,
    skip
  } = getPagination(
    rawPage,
    rawLimit
  );

  const {
    coupons,
    totalItems
  } = await couponRepository.findAllPaginated({
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

  const processedCoupons = coupons.map(coupon => {
    const isUsed = userId
      ? coupon.usages?.length > 0
      : undefined;

    const {
      usages,
      ...restData
    } = coupon;

    return {
      ...restData,
      usedCount: restData.usedCount,
      ...(userId && {
        isUsed
      }),
      isOutOfStock:
        restData.usedCount >= restData.usageLimit
    };
  });

  return {
    coupons: processedCoupons,
    pagination: getPaginationMetadata(
      totalItems,
      page,
      limit
    )
  };
},

getAllClientCoupons: async (
  queryParams = {},
  userId
) => {
  const {
    page: rawPage,
    limit: rawLimit
  } = queryParams;

  const {
    page,
    limit,
    skip
  } = getPagination(
    rawPage,
    rawLimit
  );

  const {
    coupons,
    totalItems
  } = await couponRepository.findAllClient({
    userId,
    skip,
    take: limit
  });

  const processedCoupons = coupons.map(coupon => {
    const {
      usages,
      ...restData
    } = coupon;

    return {
      ...restData,

      isUsed: usages.length > 0,

      isOutOfStock:
        coupon.usedCount >= coupon.usageLimit
    };
  });

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
  },

sendCouponNotifications: async () => {
  const coupons = await couponRepository.findCouponsReadyForNotification();
  if (!coupons.length) {
    return;
  }
  for (const coupon of coupons) {
    try {
      const users = await couponRepository.findEligibleUserIdsForNotification(
          coupon.id
        );
      if (!users.length) {
        console.log(
          `[COUPON] No eligible users for coupon ${coupon.code}`
        );
        await couponRepository.markNotificationSent(
          coupon.id
        );
        continue;
      }
      const discountText =
        formatDiscount(coupon);
      const minOrderAmount =
        formatCurrency(coupon.minOrderAmount);
      const content =
        NOTIFICATION_CONSTANTS.COUPON.AVAILABLE_CONTENT({
          discountText,
          minOrderAmount
        });

      const results = await Promise.allSettled(
        users.map(user =>
          notificationService.createNotification({
            userId: user.id,
            title: NOTIFICATION_CONSTANTS.COUPON.AVAILABLE_TITLE,
            content,
            type: NOTIFICATION_CONSTANTS.TYPE.COUPON,
            data: {
              couponId: coupon.id
            }
          })
        )
      );
      const successCount =
        results.filter(
          result => result.status === 'fulfilled'
        ).length;

      const failedCount = results.filter(
          result => result.status === 'rejected'
        ).length;
      console.log(
        `[COUPON] ${coupon.code}: ${successCount} notifications sent, ${failedCount} failed`
      );
      await couponRepository.markNotificationSent(
        coupon.id
      );
      console.log(
        `[COUPON] Notification completed: ${coupon.code}`
      );
    } catch (error) {
      console.error(
        `[COUPON] Failed to notify coupon ${coupon.id}:`,
        error
      );
    }
  }
},
};

module.exports = couponService;