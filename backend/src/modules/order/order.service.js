const orderRepository = require('./order.repository');
const SHIPPING_CONFIG = require('./shipping.config');
const { ORDER_MESSAGES, ORDER_STATUS, ORDER_CANCELLED_BY  } = require('./order.constants');
const paginationHelper = require('../../utils/pagination');
const prisma = require('../../config/database');
const { PAYMENT_METHOD, PAYMENT_MESSAGES, PAYMENT_STATUS} = require('../payment/payment.constants');
const auditLogService = require('../auditLog/auditLog.service');
const notificationService = require('../notification/notification.service');
const { TYPE, ORDER: NOTIFICATION_ORDER } = require('../notification/notification.constants');

const ORDER_EXPIRE_MINUTES =
  Number(process.env.ORDER_EXPIRE_MINUTES) || 30;

const orderService = {
calculateOrderData: async (userId, { cartItemIds, buyNowItems, province, couponCode }) => {
  let itemsToProcess = [];

  if (buyNowItems && buyNowItems.length > 0) {
    itemsToProcess = await orderRepository.findBuyNowItems(buyNowItems);
  } else if (cartItemIds && cartItemIds.length > 0) {
    itemsToProcess = await orderRepository.findSelectedCartItems(userId, cartItemIds);
  }

  if (!itemsToProcess || itemsToProcess.length === 0) {
    throw new Error(ORDER_MESSAGES.CART_EMPTY || 'Không có sản phẩm nào để thanh toán!');
  }

  let subtotal = 0;

  const itemsData = itemsToProcess.map(item => {
    const flashSale = item.variant.flashSaleVariants?.[0];

    const originalPrice = Number(item.variant.price);
    const flashSalePrice = flashSale ? Number(flashSale.flashSalePrice) : null;
    const unitPrice = flashSalePrice ?? originalPrice;

    const sub = unitPrice * item.quantity;
    subtotal += sub;

    return {
      productVariantId: item.productVariantId,
      flashSaleVariantId: flashSale?.id ?? null,
      productName: item.variant.product.name,
      color: item.variant.color,
      size: item.variant.size,
      originalPrice,
      unitPrice,
      quantity: item.quantity,
      subtotal: sub
    };
  });

  let shippingFee = SHIPPING_CONFIG.BASE_FEE;

  if (subtotal >= SHIPPING_CONFIG.FREESHIP_THRESHOLD) {
    shippingFee = 0;
  } else if (province) {
    const cleanProvince = province.replace(/^(Thành phố|Tỉnh)\s+/i, "").trim();
    const matchedZone = SHIPPING_CONFIG.ZONES.find(zone =>
      zone.provinces.some(p => p.toLowerCase() === cleanProvince.toLowerCase())
    );

    if (matchedZone) shippingFee = matchedZone.fee;
  }

  let discountAmount = 0;
  let appliedCouponId = null;
  let appliedCouponCode = null;

  if (couponCode) {
    const coupon = await orderRepository.findCouponByCode(couponCode.trim().toUpperCase());
    const now = new Date();

    if (coupon && coupon.isActive && now >= coupon.startDate && now <= coupon.endDate) {
      if (coupon.usageLimit <= 0) {
        throw new Error('Mã giảm giá này đã hết lượt sử dụng!');
      }

      const hasUsed = await orderRepository.checkUserCouponUsage(userId, coupon.id);

      if (hasUsed) {
        throw new Error('Bạn đã sử dụng mã giảm giá này rồi! Mỗi tài khoản chỉ được dùng 1 lần.');
      }

      if (subtotal >= Number(coupon.minOrderAmount)) {
        appliedCouponId = coupon.id;
        appliedCouponCode = coupon.code;

        const discountValue = Number(coupon.discountValue);

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = Math.min(
            (subtotal * discountValue) / 100,
            Number(coupon.maxDiscountAmount)
          );
        } else {
          discountAmount = discountValue;
        }
      } else {
        throw new Error(ORDER_MESSAGES.COUPON_MIN_NOT_MET);
      }
    } else {
      throw new Error(ORDER_MESSAGES.COUPON_INVALID);
    }
  }

  let totalAmount = subtotal + shippingFee - discountAmount;

  if (totalAmount < 0) totalAmount = 0;

  return {
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    itemsData,
    appliedCouponId,
    appliedCouponCode
  };
},
previewOrder: async (userId, payload) => {
    const data = await orderService.calculateOrderData(userId, payload);
    return {
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      couponCode: data.appliedCouponCode,
      items: data.itemsData
    };
  },

 createOrder: async (userId, payload) => {
  const {
    cartItemIds,
    province,
    ward,
    addressLine,
    receiverName,
    phoneNumber,
    note
  } = payload;

  const paymentMethod = payload.paymentMethod?.trim().toUpperCase();

  if (!paymentMethod) {
    throw new Error(PAYMENT_MESSAGES.INVALID_PAYMENT_METHOD);
  }

  if (!Object.values(PAYMENT_METHOD).includes(paymentMethod)) {
    throw new Error(PAYMENT_MESSAGES.INVALID_PAYMENT_METHOD);
  }

  const calcData = await orderService.calculateOrderData(
    userId,
    payload
  );

  const orderNumber = `ORD-${Math.floor(Date.now() / 1000)}`;

  const orderData = {
    userId,
    orderNumber,
    status: ORDER_STATUS.PENDING,
    receiverName,
    phoneNumber,
    province,
    ward,
    addressLine,
    subtotal: calcData.subtotal,
    discountAmount: calcData.discountAmount,
    shippingFee: calcData.shippingFee,
    totalAmount: calcData.totalAmount,
    couponCode: calcData.appliedCouponCode,
    note
  };

  const { order, lowStockVariants } = await orderRepository.createOrderTransaction({
    orderData,
    orderItemsData: calcData.itemsData,
    cartItemIds,
    couponId: calcData.appliedCouponId,
    userId,
    paymentMethod
  });

  await auditLogService.createAuditLog({
    userId,
    action: 'CREATE',
    entityName: 'Order',
    entityId: order.id,
    oldValues: null,
    newValues: {
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentMethod
    }
  });

  try {
    await notificationService.createNotification({
      userId,
      title: NOTIFICATION_ORDER.CREATED_TITLE,
      content: NOTIFICATION_ORDER.CREATED_CONTENT(order.orderNumber),
      type: TYPE.ORDER_CREATED,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber
      }
    });

      await notificationService.notifyAdmins({ 
          title: NOTIFICATION.ADMIN.NEW_ORDER_TITLE, 
          content: NOTIFICATION.ADMIN.NEW_ORDER_CONTENT( order.orderNumber ), 
          type: TYPE.ADMIN_NEW_ORDER, 
          data: { 
            orderId: order.id, 
            orderNumber: order.orderNumber, 
            status: order.status, 
            totalAmount: order.totalAmount } 
          });

           for (const variant of lowStockVariants) {
      await notificationService.notifyAdmins({
        title: NOTIFICATION.ADMIN.LOW_STOCK_TITLE,
        content: NOTIFICATION.ADMIN.LOW_STOCK_CONTENT(
          variant.productName
        ),
        type: TYPE.ADMIN_LOW_STOCK,
        data: {
          productId: variant.productId,
          variantId: variant.variantId,
          productName: variant.productName,
          color: variant.color,
          size: variant.size,
          stockQuantity: variant.stockQuantity
        }
      });
    }
  } catch (error) {
    console.error('Create order notification failed:', error.message);
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    paymentMethod
  };
},

cancelOrder: async (
  userId,
  orderId,
  cancelReason = ''
) => {
  const order = await orderRepository.findOrderForCancel(orderId);

  if (!order) {
    throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
  }

  if (order.userId !== userId) {
    throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new Error('Đơn hàng đã được hủy.');
  }

  const cancellableStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PROCESSING
  ];

  if (!cancellableStatuses.includes(order.status)) {
    throw new Error(
      'Chỉ có thể hủy đơn hàng đang chờ xác nhận hoặc đang xử lý.'
    );
  }

  const oldValues = {
    status: order.status,
    paymentStatus: order.payment?.status
  };

  await orderRepository.restoreOrderResourcesTransaction(
    order.id
  );

  const paymentStatus =
    order.payment.status === PAYMENT_STATUS.SUCCESS
      ? PAYMENT_STATUS.REFUNDED
      : PAYMENT_STATUS.CANCELLED;

  const reason =
    cancelReason.trim() ||
    'Khách hàng hủy đơn.';

  await orderRepository.cancelOrderTransaction({
    orderId: order.id,
    paymentId: order.payment.id,
    paymentStatus,
    cancelledBy: ORDER_CANCELLED_BY.CUSTOMER,
    cancelReason: reason
  });

  await auditLogService.createAuditLog({
    userId,
    action: 'CANCEL',
    entityName: 'Order',
    entityId: order.id,
    oldValues,
    newValues: {
      status: ORDER_STATUS.CANCELLED,
      paymentStatus,
      cancelledBy: ORDER_CANCELLED_BY.CUSTOMER,
      cancelReason: reason
    }
  });

  try {
    await notificationService.createNotification({
      userId,
      title: NOTIFICATION_ORDER.CANCELLED_TITLE,
      content: NOTIFICATION_ORDER.CANCELLED_CONTENT(order.orderNumber),
      type: TYPE.ORDER_CANCELLED,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber
      }
    });

    await notificationService.notifyAdmins({ 
      title: NOTIFICATION.ADMIN.ORDER_CANCELLED_TITLE, 
      content: `${NOTIFICATION.ADMIN.ORDER_CANCELLED_CONTENT( order.orderNumber )} 
      Lý do: ${reason}`, type: TYPE.ADMIN_ORDER_CANCELLED, 
      data: { orderId: order.id, 
        orderNumber: order.orderNumber, 
        status: ORDER_STATUS.CANCELLED, 
        cancelledBy: ORDER_CANCELLED_BY.CUSTOMER, 
        cancelReason: reason } 
      });
  } catch (error) {
    console.error('Cancel order notification failed:', error.message);
  }

  return {
    success: true,
    message: 'Hủy đơn hàng thành công.'
  };
},

  getOrderById: async (userId, orderId) => {
    const order = await orderRepository.findOrderById(orderId, userId);
    if (!order) throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
    return order;
  },
  getUserOrders: async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = query.status; 

    const { data, total } = await orderRepository.findOrdersByUserId(userId, skip, limit, status);
    
    return {
      items: data,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    };
  },

getOrdersForAdmin: async (query) => {
  const {
    page,
    limit,
    status,
    search,
    customerId
  } = query;

  const {
    page: parsedPage,
    limit: parsedLimit,
    skip
  } = paginationHelper.getPagination(page, limit);

  const where = {};

  if (customerId) {
    where.userId = customerId;
  }

  if (status) {
    where.status = status;
  }

  if (search?.trim()) {
    where.OR = [
      {
        orderNumber: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      },
      {
        receiverName: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      },
      {
        phoneNumber: {
          contains: search.trim()
        }
      }
    ];
  }

  const { orders, totalItems } =
    await orderRepository.findOrdersForAdmin({
      skip,
      limit: parsedLimit,
      where
    });

  const meta =
    paginationHelper.getPaginationMetadata(
      totalItems,
      parsedPage,
      parsedLimit
    );

  return {
    items: orders,
    meta
  };
},
 
  getOrderDetailForAdmin: async (orderId) => {
    const order = await orderRepository.findOrderDetailForAdmin(orderId);
    if (!order) throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
    return order;
  },

updateOrderStatusByAdmin: async (adminId, orderId, status) => {
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new Error(`Trạng thái [${status}] không hợp lệ!`);
  }

  const existingOrder = await orderRepository.findOrderDetailForAdmin(orderId);

  if (!existingOrder) {
    throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
  }

  const TARGET_STATUS = ORDER_STATUS.COMPLETED;
  const isChangingToCompleted = status === TARGET_STATUS;
  const wasNotCompletedBefore = existingOrder.status !== TARGET_STATUS;
  const wasCompletedBefore = existingOrder.status === TARGET_STATUS;
  const isChangingFromCompleted = status !== TARGET_STATUS;
  const items = existingOrder.items || [];

  try {
    const oldValues = {
      status: existingOrder.status,
      paymentStatus: existingOrder.payment?.status
    };

    const result = await prisma.$transaction(async tx => {
      const updated = await tx.order.update({
        where: {
          id: orderId
        },
        data: {
          status
        }
      });

      if (
        status === ORDER_STATUS.COMPLETED &&
        existingOrder.payment?.paymentMethod === PAYMENT_METHOD.COD &&
        existingOrder.payment.status === PAYMENT_STATUS.PENDING
      ) {
        await tx.payment.update({
          where: {
            id: existingOrder.payment.id
          },
          data: {
            status: PAYMENT_STATUS.SUCCESS,
            paidAt: new Date()
          }
        });
      }

      if (isChangingToCompleted && wasNotCompletedBefore) {
        for (const item of items) {
          if (item.variant?.productId) {
            await tx.product.update({
              where: {
                id: item.variant.productId
              },
              data: {
                soldCount: {
                  increment: item.quantity
                }
              }
            });
          }

          if (item.flashSaleVariantId) {
            await tx.flashSaleVariant.update({
              where: {
                id: item.flashSaleVariantId
              },
              data: {
                soldCount: {
                  increment: item.quantity
                }
              }
            });
          }
        }
      } else if (wasCompletedBefore && isChangingFromCompleted) {
        for (const item of items) {
          if (item.variant?.productId) {
            await tx.product.update({
              where: {
                id: item.variant.productId
              },
              data: {
                soldCount: {
                  decrement: item.quantity
                }
              }
            });
          }

          if (item.flashSaleVariantId) {
            await tx.flashSaleVariant.update({
              where: {
                id: item.flashSaleVariantId
              },
              data: {
                soldCount: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
      }

      return updated;
    });

    const finalPaymentStatus =
      status === ORDER_STATUS.COMPLETED &&
      existingOrder.payment?.paymentMethod === PAYMENT_METHOD.COD &&
      existingOrder.payment?.status === PAYMENT_STATUS.PENDING
        ? PAYMENT_STATUS.SUCCESS
        : existingOrder.payment?.status;

    await auditLogService.createAuditLog({
      userId: adminId,
      action: 'UPDATE_STATUS',
      entityName: 'Order',
      entityId: orderId,
      oldValues,
      newValues: {
        status: result.status,
        paymentStatus: finalPaymentStatus
      }
    });

    let notification = null;

    if (
      existingOrder.status !== status &&
      status === ORDER_STATUS.PROCESSING
    ) {
      notification = {
        title: NOTIFICATION_ORDER.CONFIRMED_TITLE,
        content: NOTIFICATION_ORDER.CONFIRMED_CONTENT(
          existingOrder.orderNumber
        ),
        type: TYPE.ORDER_CONFIRMED
      };
    }

    if (
      existingOrder.status !== status &&
      status === ORDER_STATUS.SHIPPING
    ) {
      notification = {
        title: NOTIFICATION_ORDER.SHIPPING_TITLE,
        content: NOTIFICATION_ORDER.SHIPPING_CONTENT(
          existingOrder.orderNumber
        ),
        type: TYPE.ORDER_SHIPPING
      };
    }

    if (
      existingOrder.status !== status &&
      status === ORDER_STATUS.COMPLETED
    ) {
      notification = {
        title: NOTIFICATION_ORDER.SUCCESS_TITLE,
        content: NOTIFICATION_ORDER.SUCCESS_CONTENT(
          existingOrder.orderNumber
        ),
        type: TYPE.ORDER_SUCCESS
      };
    }

    if (notification) {
      try {
        await notificationService.createNotification({
          userId: existingOrder.userId,
          title: notification.title,
          content: notification.content,
          type: notification.type,
          data: {
            orderId: existingOrder.id,
            orderNumber: existingOrder.orderNumber,
            status: result.status
          }
        });
      } catch (error) {
        console.error(
          'Order status notification failed:',
          error.message
        );
      }
    }

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(
      'Không thể cập nhật trạng thái đơn hàng và số lượng bán.'
    );
  }
},

cancelOrderByAdmin: async (
  adminId,
  orderId,
  cancelReason = ''
) => {
  const order = await orderRepository.findOrderForCancel(orderId);

  if (!order) {
    throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new Error('Đơn hàng đã được hủy.');
  }

  const cancellableStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPING
  ];

  if (!cancellableStatuses.includes(order.status)) {
    throw new Error(
      'Chỉ có thể hủy đơn hàng đang chờ xác nhận hoặc đang xử lý.'
    );
  }

  const oldValues = {
    status: order.status,
    paymentStatus: order.payment?.status
  };

  await orderRepository.restoreOrderResourcesTransaction(order.id);

  const paymentStatus =
    order.payment.status === PAYMENT_STATUS.SUCCESS
      ? PAYMENT_STATUS.REFUNDED
      : PAYMENT_STATUS.CANCELLED;

  const reason =
    cancelReason.trim() ||
    'Quản trị viên hủy đơn.';

  await orderRepository.cancelOrderTransaction({
    orderId: order.id,
    paymentId: order.payment.id,
    paymentStatus,
    cancelledBy: ORDER_CANCELLED_BY.ADMIN,
    cancelReason: reason
  });

  await auditLogService.createAuditLog({
    userId: adminId,
    action: 'CANCEL',
    entityName: 'Order',
    entityId: order.id,
    oldValues,
    newValues: {
      status: ORDER_STATUS.CANCELLED,
      paymentStatus,
      cancelledBy: ORDER_CANCELLED_BY.ADMIN,
      cancelReason: reason
    }
  });

  try {
    await notificationService.createNotification({
      userId: order.userId,
      title: NOTIFICATION_ORDER.CANCELLED_TITLE,
      content: `${NOTIFICATION_ORDER.CANCELLED_CONTENT(order.orderNumber)} Lý do: ${reason}`,
      type: TYPE.ORDER_CANCELLED,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: ORDER_STATUS.CANCELLED
      }
    });
  } catch (error) {
    console.error(
      'Admin cancel notification failed:',
      error.message
    );
  }

  return {
    success: true,
    message: 'Hủy đơn hàng thành công.'
  };
},

cancelExpiredPendingOrders: async () => {
  const expiredTime = new Date(
    Date.now() - ORDER_EXPIRE_MINUTES * 60 * 1000
  );

  const expiredOrders =
    await orderRepository.findExpiredPendingOrders(
      expiredTime
    );

  if (!expiredOrders.length) {
    return;
  }

  for (const order of expiredOrders) {
    try {
      if (!order.payment) {
        continue;
      }

      await orderRepository.restoreOrderResourcesTransaction(
        order.id
      );

      await orderRepository.cancelOrderTransaction({
        orderId: order.id,
        paymentId: order.payment.id,
        paymentStatus: PAYMENT_STATUS.CANCELLED,
        cancelledBy: ORDER_CANCELLED_BY.SYSTEM,
        cancelReason:
          'Đơn hàng tự động hủy do quá thời gian thanh toán.'
      });

      try {
        await notificationService.createNotification({
          userId: order.userId,
          title: NOTIFICATION_ORDER.CANCELLED_TITLE,
          content: `${NOTIFICATION_ORDER.CANCELLED_CONTENT(order.orderNumber)} Đơn hàng đã quá thời gian thanh toán.`,
          type: TYPE.ORDER_CANCELLED,
          data: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: ORDER_STATUS.CANCELLED
          }
        });

        await notificationService.notifyAdmins({ 
          title: NOTIFICATION.ADMIN.ORDER_CANCELLED_TITLE, 
          content: `${NOTIFICATION.ADMIN.ORDER_CANCELLED_CONTENT( order.orderNumber )} 
          Hệ thống đã tự động hủy do quá thời gian thanh toán.`, 
          type: TYPE.ADMIN_ORDER_CANCELLED, 
          data: { orderId: order.id, 
            orderNumber: order.orderNumber, 
            status: ORDER_STATUS.CANCELLED, 
            cancelledBy: ORDER_CANCELLED_BY.SYSTEM } 
          });
      } catch (error) {
        console.error(
          'Auto cancel notification failed:',
          error.message
        );
      }

      console.log(
        `[AUTO CANCEL] ${order.orderNumber} đã được hủy.`
      );
    } catch (err) {
      console.error(
        `[AUTO CANCEL] Lỗi hủy đơn ${order.orderNumber}:`,
        err
      );
    }
  }
},
};

module.exports = orderService;