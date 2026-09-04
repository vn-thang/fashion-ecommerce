const returnRepository = require('./return.repository');
const { STATUS, MESSAGES } = require('./return.constants');
const { ORDER_STATUS } = require('../../constants/orderStatus.constant');
const { PAYMENT_METHOD, PAYMENT_STATUS } = require('../../constants/paymentStatus.constant');

const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const { createAuditLog } = require('../auditLog/auditLog.service');
const paymentService = require('../payment/payment.service');
const notificationService = require('../notification/notification.service');

const DEFAULT_LIMIT = 10;

const returnService = {
  createReturnRequest: async (
    userId,
    {
      orderId,
      reason,
      description,
      items
    }
  ) => {
    const orderRecord =
    await returnRepository.findOrderByIdAndUser(
        orderId,
        userId
    );

    if (!orderRecord) {
    throw new Error(MESSAGES.ORDER_NOT_FOUND);
    }

    if (orderRecord.status !== ORDER_STATUS.COMPLETED) {
    throw new Error(MESSAGES.ORDER_NOT_ELIGIBLE);
    }

    const orderItemIds = items.map(item => item.orderItemId);

const orderItems =
  await returnRepository.findOrderItemsByIds(
    orderItemIds,
    orderId
  );

    if (orderItems.length !== items.length) {
      throw new Error(MESSAGES.RETURN_ITEM_INVALID);
    }

    const existingReturns =
      await returnRepository.findExistingByOrderItem(orderItemIds);

    const returnQuantityMap = new Map();

    for (const item of existingReturns) {
      const current =
        returnQuantityMap.get(item.orderItemId) || 0;

      returnQuantityMap.set(
        item.orderItemId,
        current + item.quantity
      );
    }

    for (const item of items) {
      const orderItem = orderItems.find(
        orderItem =>
          orderItem.id === item.orderItemId
      );

      const alreadyReturned =
        returnQuantityMap.get(item.orderItemId) || 0;

      const remainingQuantity =
        orderItem.quantity - alreadyReturned;

      if (
        item.quantity > remainingQuantity ||
        item.quantity <= 0
      ) {
        throw new Error(MESSAGES.RETURN_QUANTITY_INVALID);
      }
    }

const refundAmount = items.reduce((total, item) => {
  const orderItem = orderItems.find(
    orderItem => orderItem.id === item.orderItemId
  );

  const netAmount =
    Number(orderItem.subtotal || 0) -
    Number(orderItem.discountAmount || 0);

  const netUnitPrice =
    orderItem.quantity > 0
      ? netAmount / orderItem.quantity
      : Number(orderItem.unitPrice || 0);

  return total + netUnitPrice * item.quantity;
}, 0);

const returnRequest =
  await returnRepository.createTransaction({
    returnData: {
      orderId,
      userId,
      status: STATUS.REQUESTED,
      reason,
      description: description?.trim() || null,
      refundAmount
    },
    items
  });

    await createAuditLog({
      userId,
      action: 'CREATE',
      entityName: 'ReturnRequest',
      entityId: returnRequest.id,
      newValues: {
        orderId,
        reason,
        description,
        items
      }
    });

    try {
      await notificationService.notifyAdmins({
        title: 'Có yêu cầu trả hàng mới',
        content:
          `Khách hàng vừa gửi yêu cầu trả hàng cho đơn ${returnRequest.order.orderNumber}.`,
        type: 'ADMIN_RETURN_REQUESTED',
        data: {
          returnRequestId: returnRequest.id,
          orderId,
          orderNumber: returnRequest.order.orderNumber
        }
      });
    } catch (error) {
      console.error(
        'Return request notification failed:',
        error.message
      );
    }

    return returnRequest;
  },

  getCustomerReturns: async (
    userId,
    queryParams = {}
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
      rawLimit,
      DEFAULT_LIMIT
    );

    const result =
      await returnRepository.findAll({
        skip,
        take: limit,
        where: {
          userId
        }
      });

    return {
      returns: result.returns,
      pagination: getPaginationMetadata(
        result.totalItems,
        page,
        limit
      )
    };
  },

  getReturnsByOrderId: async (userId, orderId) => {
  const orderRecord =
    await returnRepository.findOrderByIdAndUser(
      orderId,
      userId
    );

  if (!orderRecord) {
    throw new Error(MESSAGES.ORDER_NOT_FOUND);
  }

  return await returnRepository.findByOrderId(
    orderId,
    userId
  );
},

  getReturnByCustomer: async (
    userId,
    returnId
  ) => {
    const returnRequest =
      await returnRepository.findByIdAndUser(
        returnId,
        userId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    return returnRequest;
  },

  getAllReturns: async (queryParams = {}) => {
    const {
      search,
      status,
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const {
      page,
      limit,
      skip
    } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            order: {
              orderNumber: {
                contains: search,
                mode: 'insensitive'
              }
            }
          }
        : {})
    };

    const result =
      await returnRepository.findAll({
        skip,
        take: limit,
        where
      });

    return {
      returns: result.returns,
      pagination: getPaginationMetadata(
        result.totalItems,
        page,
        limit
      )
    };
  },

  getReturnByAdmin: async returnId => {
    const returnRequest =
      await returnRepository.findById(
        returnId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    return returnRequest;
  },

  approveReturn: async (
    adminId,
    returnId
  ) => {
    const returnRequest =
      await returnRepository.findById(
        returnId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    if (
      returnRequest.status !==
      STATUS.REQUESTED
    ) {
      throw new Error(MESSAGES.INVALID_STATUS);
    }

    const updatedReturn =
      await returnRepository.updateStatus(
        returnId,
        {
          status: STATUS.APPROVED,
          approvedAt: new Date()
        }
      );

    await createAuditLog({
      userId: adminId,
      action: 'APPROVE',
      entityName: 'ReturnRequest',
      entityId: returnId,
      oldValues: {
        status: STATUS.REQUESTED
      },
      newValues: {
        status: STATUS.APPROVED
      }
    });

    try {
      await notificationService.createNotification({
        userId: returnRequest.user.id,
        title: 'Yêu cầu trả hàng được chấp nhận',
        content:
          `Yêu cầu trả hàng cho đơn ${returnRequest.order.orderNumber} đã được chấp nhận.`,
        type: 'RETURN_APPROVED',
        data: {
          returnRequestId: returnId,
          orderId: returnRequest.order.id
        }
      });
    } catch (error) {
      console.error(
        'Return approve notification failed:',
        error.message
      );
    }

    return updatedReturn;
  },

  rejectReturn: async (
    adminId,
    returnId,
    rejectReason
  ) => {
    const returnRequest =
      await returnRepository.findById(
        returnId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    if (
      returnRequest.status !==
      STATUS.REQUESTED
    ) {
      throw new Error(MESSAGES.INVALID_STATUS);
    }

    const updatedReturn =
      await returnRepository.updateStatus(
        returnId,
        {
          status: STATUS.REJECTED,
          rejectedAt: new Date(),
          rejectReason:
            rejectReason.trim()
        }
      );

    await createAuditLog({
      userId: adminId,
      action: 'REJECT',
      entityName: 'ReturnRequest',
      entityId: returnId,
      oldValues: {
        status: STATUS.REQUESTED
      },
      newValues: {
        status: STATUS.REJECTED,
        rejectReason
      }
    });

    try {
      await notificationService.createNotification({
        userId: returnRequest.user.id,
        title: 'Yêu cầu trả hàng bị từ chối',
        content:
          `Yêu cầu trả hàng cho đơn ${returnRequest.order.orderNumber} bị từ chối. Lý do: ${rejectReason}`,
        type: 'RETURN_REJECTED',
        data: {
          returnRequestId: returnId,
          orderId: returnRequest.order.id
        }
      });
    } catch (error) {
      console.error(
        'Return reject notification failed:',
        error.message
      );
    }

    return updatedReturn;
  },

  markShipping: async (
    userId,
    returnId
  ) => {
    const returnRequest =
      await returnRepository.findByIdAndUser(
        returnId,
        userId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    if (
      returnRequest.status !==
      STATUS.APPROVED
    ) {
      throw new Error(MESSAGES.INVALID_STATUS);
    }

    return await returnRepository.updateStatus(
      returnId,
      {
        status: STATUS.SHIPPING
      }
    );
  },

  markReceived: async (
    adminId,
    returnId
  ) => {
    const returnRequest =
      await returnRepository.findById(
        returnId
      );

    if (!returnRequest) {
      throw new Error(MESSAGES.RETURN_NOT_FOUND);
    }

    if (
      returnRequest.status !==
      STATUS.SHIPPING
    ) {
      throw new Error(MESSAGES.RECEIVED_INVALID);
    }

    const updatedReturn =
      await returnRepository.updateStatus(
        returnId,
        {
          status: STATUS.RECEIVED,
          receivedAt: new Date()
        }
      );

    await createAuditLog({
      userId: adminId,
      action: 'RECEIVE_RETURN',
      entityName: 'ReturnRequest',
      entityId: returnId,
      oldValues: {
        status: STATUS.SHIPPING
      },
      newValues: {
        status: STATUS.RECEIVED
      }
    });

    return updatedReturn;
  },

completeReturn: async (
  adminId,
  returnId,
  ipAddress
) => {
  const returnRequest =
    await returnRepository.findById(returnId);

  if (!returnRequest) {
    throw new Error(MESSAGES.RETURN_NOT_FOUND);
  }

  if (returnRequest.status !== STATUS.RECEIVED) {
    throw new Error(MESSAGES.INVALID_STATUS);
  }

  if (!returnRequest.order.payment) {
    throw new Error(MESSAGES.REFUND_FAILED);
  }

  const payment = returnRequest.order.payment;

  const refundAmount = Math.round(
    returnRequest.items.reduce(
      (total, item) => {
        const orderItem = item.orderItem;
        const itemSubtotal = Number(orderItem.subtotal);
        const itemDiscount = Number(orderItem.discountAmount || 0);
        const netAmount = itemSubtotal - itemDiscount;
        const netUnitPrice =
          netAmount / orderItem.quantity;

        return total + netUnitPrice * item.quantity;
      },
      0
    )
  );

  if (refundAmount <= 0) {
    throw new Error(MESSAGES.REFUND_FAILED);
  }

  let paymentStatus = payment.status;
  let refundedAmount =
    Number(payment.refundedAmount || 0);

  if (payment.paymentMethod === PAYMENT_METHOD.VNPAY) {
    if (payment.status !== PAYMENT_STATUS.SUCCESS) {
      throw new Error(MESSAGES.REFUND_FAILED);
    }

    const refundResult =
      await paymentService.refundPayment({
        orderId: returnRequest.order.id,
        amount: refundAmount,
        ipAddress,
        createdBy: adminId
      });

    paymentStatus =
      refundResult.refundedAmount >=
      Number(payment.amount)
        ? PAYMENT_STATUS.REFUNDED
        : PAYMENT_STATUS.SUCCESS;

    refundedAmount = refundResult.refundedAmount;
  } else if (
    payment.paymentMethod === PAYMENT_METHOD.COD
  ) {
    refundedAmount += refundAmount;

    paymentStatus = PAYMENT_STATUS.REFUNDED;
  } else {
    throw new Error(MESSAGES.REFUND_FAILED);
  }

  const completedReturn =
    await returnRepository.completeTransaction({
      returnId,
      refundAmount,
      paymentStatus,
      refundedAmount
    });

  await createAuditLog({
    userId: adminId,
    action: 'COMPLETE_RETURN',
    entityName: 'ReturnRequest',
    entityId: returnId,
    oldValues: {
      status: STATUS.RECEIVED,
      paymentStatus: payment.status,
      refundedAmount:
        Number(payment.refundedAmount || 0)
    },
    newValues: {
      status: STATUS.COMPLETED,
      paymentStatus,
      refundAmount,
      refundedAmount
    }
  });

  try {
    await notificationService.createNotification({
      userId: returnRequest.user.id,
      title: 'Hoàn trả hàng thành công',
      content:
        `Yêu cầu trả hàng cho đơn ${returnRequest.order.orderNumber} đã hoàn tất. Số tiền hoàn: ${refundAmount.toLocaleString('vi-VN')}đ.`,
      type: 'RETURN_COMPLETED',
      data: {
        returnRequestId: returnId,
        orderId: returnRequest.order.id,
        refundAmount,
        paymentStatus
      }
    });
  } catch (error) {
    console.error(
      'Return complete notification failed:',
      error.message
    );
  }

  return completedReturn;
},

cancelReturnRequest: async (userId, returnId) => {
  const returnRequest =
    await returnRepository.findByIdAndUser(
      returnId,
      userId
    );

  if (!returnRequest) {
    throw new Error(MESSAGES.RETURN_NOT_FOUND);
  }

  if (
    ![
      STATUS.REQUESTED,
      STATUS.APPROVED
    ].includes(returnRequest.status)
  ) {
    throw new Error(MESSAGES.INVALID_STATUS);
  }

  const cancelledReturn =
    await returnRepository.updateStatus(returnId, {
      status: STATUS.CANCELLED,
    });

  await createAuditLog({
    userId,
    action: 'CANCEL',
    entityName: 'ReturnRequest',
    entityId: returnId,
    newValues: {
      status: STATUS.CANCELLED
    }
  });

  return cancelledReturn;
},
};

module.exports = returnService;