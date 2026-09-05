const paymentRepository = require('./payment.repository');

const paymentConfig = require('./payment.config');
const paymentUtils = require('./payment.utils');
const axios = require('axios');
const crypto = require('crypto'); 

const { ORDER_STATUS } = require('../../constants/orderStatus.constant');
const orderRepository = require('../order/order.repository');
const paginationHelper = require('../../utils/pagination');
const notificationService = require('../notification/notification.service');
const NOTIFICATION_CONSTANTS = require('../notification/notification.constants');

const {
  PAYMENT_MESSAGES,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  VNPAY_RESPONSE_CODE
} = require('./payment.constants');



const paymentService = {
  createPaymentUrl: async ({ orderId, ipAddress }) => { console.log('[VNPAY CREATE] called');
    console.log(
  '[VNPAY SECRET FINGERPRINT]',
  crypto
    .createHash('sha256')
    .update(paymentConfig.hashSecret)
    .digest('hex')
);
  const order = await paymentRepository.findOrderById(orderId);

  if (!order)
    throw new Error(PAYMENT_MESSAGES.ORDER_NOT_FOUND);

  if (!order.payment)
    throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);

  if (order.status !== ORDER_STATUS.PENDING)
    throw new Error(PAYMENT_MESSAGES.ORDER_INVALID_STATUS);

  if (order.payment.paymentMethod !== PAYMENT_METHOD.VNPAY)
    throw new Error(PAYMENT_MESSAGES.INVALID_PAYMENT_METHOD);

  if (order.payment.status === PAYMENT_STATUS.SUCCESS)
    throw new Error(PAYMENT_MESSAGES.ORDER_ALREADY_PAID);

  const txnRef = order.orderNumber;
  const clientIp = ipAddress === '::1' ? '127.0.0.1' : ipAddress;
console.log('[VNPAY CONFIG]', {
  tmnCode: paymentConfig.tmnCode,
  hashSecretLength: paymentConfig.hashSecret?.length,
  hashSecretHasQuotes:
    paymentConfig.hashSecret?.startsWith('"') ||
    paymentConfig.hashSecret?.endsWith('"'),
  returnUrl: paymentConfig.returnUrl
});

const createDate = paymentUtils.createDate();
const expireDate = paymentUtils.createExpireDate();
console.log('[VNPAY TIME]', {
  serverNow: new Date().toISOString(),
  createDate,
  expireDate
});
  const params = {
    vnp_Version: paymentConfig.version,
    vnp_Command: paymentConfig.command,
    vnp_TmnCode: paymentConfig.tmnCode,
    vnp_Locale: paymentConfig.locale,
    vnp_CurrCode: paymentConfig.currency,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: order.orderNumber,
    vnp_OrderType: paymentConfig.orderType,
    vnp_Amount: Math.round(Number(order.totalAmount) * 100),
    vnp_ReturnUrl: paymentConfig.returnUrl,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: paymentUtils.createDate(),
    vnp_ExpireDate: paymentUtils.createExpireDate()
  };
const paymentUrl = paymentUtils.buildPaymentUrl(params);

return {
  paymentUrl,
  orderId: order.id,
  orderNumber: order.orderNumber,
  amount: Number(order.totalAmount),
  expiredAt: params.vnp_ExpireDate
};
},

handleReturn: async query => {
    console.log('===== VNPAY RETURN =====');
  console.log(query);
  if (!paymentUtils.verifySecureHash(query)) {
    throw new Error(PAYMENT_MESSAGES.INVALID_SIGNATURE);
  }

  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || null;
  const order = await paymentRepository.findOrderByOrderNumber(txnRef);
  if (!order) {
    throw new Error(PAYMENT_MESSAGES.ORDER_NOT_FOUND);
  }
  if (!order.payment) {
    throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);
  }

  if (order.payment.status !== PAYMENT_STATUS.PENDING) {
  return {
    success: order.payment.status === PAYMENT_STATUS.SUCCESS,
    orderId: order.id,
    orderNumber: order.orderNumber,
    receiverName: order.receiverName,
    phoneNumber: order.phoneNumber,
    address: `${order.addressLine}, ${order.ward}, ${order.province}`,
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount),
    shippingFee: Number(order.shippingFee),
    totalAmount: Number(order.totalAmount),
    amount: Number(order.payment.amount),
    paymentMethod: order.payment.paymentMethod,
    transactionNo: order.payment.transactionNo,
    paymentStatus: order.payment.status,
    message: 'Đơn hàng đã được xử lý.'
  };
}

  const gatewayAmount =
    Number(query.vnp_Amount) / 100;

  const orderAmount =
    Number(order.totalAmount);

  if (gatewayAmount !== orderAmount) {
    throw new Error(PAYMENT_MESSAGES.INVALID_AMOUNT);
  }

  const paymentStatus =
    responseCode === VNPAY_RESPONSE_CODE.SUCCESS
      ? PAYMENT_STATUS.SUCCESS
      : responseCode === VNPAY_RESPONSE_CODE.USER_CANCEL
        ? PAYMENT_STATUS.CANCELLED
        : PAYMENT_STATUS.FAILED;

  const orderStatus =
    paymentStatus === PAYMENT_STATUS.SUCCESS
      ? ORDER_STATUS.PROCESSING
      : ORDER_STATUS.CANCELLED;
      
      console.log('[VNPAY] Before update:', {
  paymentId: order.payment.id,
  orderId: order.id,
  paymentStatus,
  transactionRef: txnRef,
  transactionNo,
  transactionDate: query.vnp_PayDate || null
});

  await paymentRepository.updatePaymentAndOrderTransaction({
    paymentId: order.payment.id,
    orderId: order.id,
    orderStatus,
    paymentData: {
      status: paymentStatus,
      transactionRef: txnRef,
      transactionNo,
      // transactionDate: query.vnp_CreateDate || null,
      transactionDate: query.vnp_PayDate || null,
      gatewayResponseCode: responseCode,
      paidAt:
        paymentStatus === PAYMENT_STATUS.SUCCESS
          ? new Date()
          : null
    }
  });

console.log('[VNPAY] Payment/Order updated successfully');
  if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
    await orderRepository.deleteCartItemsByOrder(order.id);
  } else {
    await orderRepository.restoreOrderResourcesTransaction(
      order.id,
      {
        restoreCoupon: true
      }
    );
  }
  try {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán thành công',
        content: `Thanh toán đơn hàng ${order.orderNumber} thành công.`,
        type: NOTIFICATION_CONSTANTS.TYPE.PAYMENT_SUCCESS,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_SUCCESS_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_SUCCESS_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_SUCCESS,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    } else if (
      paymentStatus === PAYMENT_STATUS.CANCELLED
    ) {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán đã bị hủy',
        content:
          `Thanh toán đơn hàng ${order.orderNumber} đã bị hủy.`,
        type:
          NOTIFICATION_CONSTANTS.TYPE.PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_CANCELLED_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_CANCELLED_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_CANCELLED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    } else {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán thất bại',
        content:
          `Thanh toán đơn hàng ${order.orderNumber} không thành công.`,
        type:
          NOTIFICATION_CONSTANTS.TYPE.PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_FAILED_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_FAILED_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    }
  } catch (notificationError) {
    console.error(
      '[NOTIFICATION] Payment notification failed:',
      notificationError
    );
  }
if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    receiverName: order.receiverName,
    phoneNumber: order.phoneNumber,
    address: `${order.addressLine}, ${order.ward}, ${order.province}`,
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount),
    shippingFee: Number(order.shippingFee),
    totalAmount: Number(order.totalAmount),
    amount: Number(order.payment.amount),
    paymentMethod: order.payment.paymentMethod,
    transactionNo: order.payment.transactionNo,
    paymentStatus,
    message: PAYMENT_MESSAGES.PAYMENT_SUCCESS
  };
}
 const result = {
  success: true,
  orderId: order.id,
  orderNumber: order.orderNumber,
  receiverName: order.receiverName,
  phoneNumber: order.phoneNumber,
  address: `${order.addressLine}, ${order.ward}, ${order.province}`,
  subtotal: Number(order.subtotal),
  discountAmount: Number(order.discountAmount),
  shippingFee: Number(order.shippingFee),
  totalAmount: Number(order.totalAmount),
  amount: Number(order.payment.amount),
  paymentMethod: order.payment.paymentMethod,
  transactionNo: order.payment.transactionNo,
  paymentStatus,
  message: PAYMENT_MESSAGES.PAYMENT_SUCCESS
};
  return result;
},

handleIpn: async query => {
  if (!paymentUtils.verifySecureHash(query)) {
    return {
      RspCode: '97',
      Message: 'Invalid Checksum'
    };
  }
  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || null;
  const order =
    await paymentRepository.findOrderByOrderNumber(
      txnRef
    );
    console.log('[VNPAY] After update:', {
  orderStatus: updatedOrder?.status,
  paymentStatus: updatedOrder?.payment?.status,
  transactionNo: updatedOrder?.payment?.transactionNo,
  transactionDate: updatedOrder?.payment?.transactionDate
});

  if (!order) {
    return {
      RspCode: '01',
      Message: 'Order not Found'
    };
  }
  if (!order.payment) {
    return {
      RspCode: '01',
      Message: 'Payment not Found'
    };
  }
  if (
    order.payment.status !==
    PAYMENT_STATUS.PENDING
  ) {
    return {
      RspCode: '00',
      Message: 'Confirm Success'
    };
  }
  const gatewayAmount = Number(query.vnp_Amount) / 100;
  const orderAmount = Number(order.totalAmount);

  if (gatewayAmount !== orderAmount) {
    return {
      RspCode: '04',
      Message: 'Invalid Amount'
    };
  }
  const paymentStatus =
    responseCode === VNPAY_RESPONSE_CODE.SUCCESS
      ? PAYMENT_STATUS.SUCCESS
      : responseCode === VNPAY_RESPONSE_CODE.USER_CANCEL
        ? PAYMENT_STATUS.CANCELLED
        : PAYMENT_STATUS.FAILED;

  const orderStatus =
    paymentStatus === PAYMENT_STATUS.SUCCESS
      ? ORDER_STATUS.PROCESSING
      : ORDER_STATUS.CANCELLED;

  await paymentRepository.updatePaymentAndOrderTransaction({
    paymentId: order.payment.id,
    orderId: order.id,
    orderStatus,
    paymentData: {
      status: paymentStatus,
      transactionRef: txnRef,
      transactionNo,
      // transactionDate: query.vnp_CreateDate || null,
      transactionDate: query.vnp_PayDate || null,
      gatewayResponseCode: responseCode,
      paidAt:  paymentStatus === PAYMENT_STATUS.SUCCESS
          ? new Date()
          : null
    }
  });

  if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
    await orderRepository.deleteCartItemsByOrder(
      order.id
    );
  } else {
    await orderRepository.restoreOrderResourcesTransaction(
      order.id,
      {
        restoreCoupon: true
      }
    );
  }
  try {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán thành công',
        content:
          `Thanh toán đơn hàng ${order.orderNumber} thành công.`,
        type:
          NOTIFICATION_CONSTANTS.TYPE.PAYMENT_SUCCESS,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_SUCCESS_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_SUCCESS_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_SUCCESS,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    } else if (
      paymentStatus === PAYMENT_STATUS.CANCELLED
    ) {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán đã bị hủy',
        content:
          `Thanh toán đơn hàng ${order.orderNumber} đã bị hủy.`,
        type:
          NOTIFICATION_CONSTANTS.TYPE.PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_CANCELLED_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_CANCELLED_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_CANCELLED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    } else {
      await notificationService.createNotification({
        userId: order.userId,
        title: 'Thanh toán thất bại',
        content:
          `Thanh toán đơn hàng ${order.orderNumber} không thành công.`,
        type:
          NOTIFICATION_CONSTANTS.TYPE.PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });

      await notificationService.notifyAdmins({
        title:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_FAILED_TITLE,
        content:
          NOTIFICATION_CONSTANTS.ADMIN
            .PAYMENT_FAILED_CONTENT(
              order.orderNumber
            ),
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .ADMIN_PAYMENT_FAILED,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus
        }
      });
    }
  } catch (notificationError) {
    console.error(
      '[NOTIFICATION] Payment notification failed:',
      notificationError
    );
  }
  return {
    RspCode: '00',
    Message: 'Confirm Success'
  };
},

getPayments: async (query) => {
    const {
        page,
        limit,
        keyword,
        paymentMethod,
        status,
        orderStatus,
        fromDate,
        toDate
    } = query;

    const {
        page: currentPage,
        limit: pageSize,
        skip
    } = paginationHelper.getPagination(page, limit);

    const where = {};

    if (status) {
        where.status = status;
    }

    if (paymentMethod) {
        where.paymentMethod = paymentMethod;
    }

    if (fromDate || toDate) {
        where.createdAt = {};

        if (fromDate) {
            where.createdAt.gte = new Date(fromDate);
        }

        if (toDate) {
            where.createdAt.lte = new Date(toDate);
        }
    }

    if (orderStatus) {
        where.order = {
            ...(where.order || {}),
            status: orderStatus
        };
    }

    if (keyword) {
        where.OR = [
            {
                transactionRef: {
                    contains: keyword,
                    mode: 'insensitive'
                }
            },
            {
                transactionNo: {
                    contains: keyword,
                    mode: 'insensitive'
                }
            },
            {
                order: {
                    orderNumber: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                }
            },
            {
                order: {
                    receiverName: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                }
            },
            {
                order: {
                    phoneNumber: {
                        contains: keyword
                    }
                }
            },
            {
                order: {
                    user: {
                        email: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        ];
    }
    const { payments, totalItems } = await paymentRepository.findPayments({
        skip,
        limit: pageSize,
        where
    });
    return {
        items: payments,
        meta: paginationHelper.getPaginationMetadata(
            totalItems,
            currentPage,
            pageSize
        )
    };
},

getPaymentDetail: async (paymentId) => {
    const payment =
        await paymentRepository.findPaymentDetail(paymentId);

    if (!payment) {
        throw new Error(
            PAYMENT_MESSAGES.PAYMENT_NOT_FOUND
        );
    }

    return payment;
},

refundPayment: async ({
  orderId,
  amount,
  ipAddress,
  createdBy
}) => {
  const order = await paymentRepository.findOrderById(orderId);

  if (!order) {
    throw new Error(PAYMENT_MESSAGES.INVALID_ORDER);
  }

  if (!order.payment) {
    throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);
  }

  const payment = order.payment;

  if (payment.paymentMethod !== PAYMENT_METHOD.VNPAY) {
    throw new Error(PAYMENT_MESSAGES.REFUND_INVALID_PAYMENT);
  }

if (payment.status !== PAYMENT_STATUS.SUCCESS) {
  throw new Error(PAYMENT_MESSAGES.REFUND_INVALID_PAYMENT);
}

  if (
    !payment.transactionRef ||
    !payment.transactionNo ||
    !payment.transactionDate
  ) {
    throw new Error(PAYMENT_MESSAGES.REFUND_INVALID_PAYMENT);
  }

  const refundAmount = Number(amount);

  if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
    throw new Error(PAYMENT_MESSAGES.REFUND_INVALID_PAYMENT);
  }

  const originalAmount = Number(payment.amount);
  const refundedAmount = Number(payment.refundedAmount || 0);
  const remainingAmount = originalAmount - refundedAmount;

  if (refundAmount > remainingAmount) {
    throw new Error(PAYMENT_MESSAGES.REFUND_INVALID_PAYMENT);
  }

  const transactionType =
    refundAmount === remainingAmount ? '02' : '03';

  const requestId =
    `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const createDate = paymentUtils.createDate();

  const vnpAmount = Math.round(refundAmount * 100);

  const orderInfo =
    `Hoan tien don hang ${order.orderNumber}`;

  const refundParams = {
    vnp_RequestId: requestId,
    vnp_Version: paymentConfig.version,
    vnp_Command: 'refund',
    vnp_TmnCode: paymentConfig.tmnCode,
    vnp_TransactionType: transactionType,
    vnp_TxnRef: payment.transactionRef,
    vnp_Amount: vnpAmount,
    vnp_TransactionNo: payment.transactionNo,
    vnp_TransactionDate: payment.transactionDate,
    vnp_CreateBy: createdBy,
    vnp_CreateDate: createDate,
    vnp_IpAddr: ipAddress,
    vnp_OrderInfo: orderInfo
  };

  const secureHash =
    paymentUtils.createRefundSecureHash(refundParams);

  const requestBody = {
    ...refundParams,
    vnp_SecureHash: secureHash
  };

  let response;

  try {
    response = await axios.post(
      paymentConfig.apiUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
  } catch (error) {
  console.error(
    '[VNPAY REFUND] REQUEST ERROR:',
    {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    }
  );

    throw new Error(PAYMENT_MESSAGES.REFUND_FAILED);
  }

const result = response.data;

if (result?.vnp_ResponseCode !== '00') {
  console.error(
    '[VNPAY REFUND] Failed:',
    result
  );

  throw new Error(
    result?.vnp_Message ||
    PAYMENT_MESSAGES.REFUND_FAILED
  );
}

const newRefundedAmount =
  refundedAmount + refundAmount;

const newPaymentStatus =
  newRefundedAmount >= originalAmount
    ? PAYMENT_STATUS.REFUNDED
    : PAYMENT_STATUS.SUCCESS;

await paymentRepository.updateRefundAmount(
  payment.id,
  newRefundedAmount,
  newPaymentStatus
);

return {
  success: true,
  amount: refundAmount,
  refundedAmount: newRefundedAmount,
  remainingAmount: originalAmount - newRefundedAmount,
  transactionType,
  responseCode: result.vnp_ResponseCode,
  message: result.vnp_Message,
  transactionNo: result.vnp_TransactionNo || null,
  transactionStatus: result.vnp_TransactionStatus || null
};
},
};

module.exports = paymentService;
