const paymentRepository = require('./payment.repository');

const paymentConfig = require('./payment.config');
const paymentUtils = require('./payment.utils');

const { ORDER_STATUS } = require('../../constants/orderStatus.constant');
const { PAYMENT_STATUS } = require('../../constants/paymentStatus.constant');
const orderRepository = require('../order/order.repository');
const paginationHelper = require('../../utils/pagination');

const {
  PAYMENT_MESSAGES,
  PAYMENT_METHOD,
  VNPAY_RESPONSE_CODE
} = require('./payment.constants');

const paymentService = {
  createPaymentUrl: async ({ orderId, ipAddress }) => {
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
  return {
    paymentUrl: paymentUtils.buildPaymentUrl(params),
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: Number(order.totalAmount),
    expiredAt: params.vnp_ExpireDate
  };
},

handleReturn: async query => {
  if (!paymentUtils.verifySecureHash(query))
    throw new Error(PAYMENT_MESSAGES.INVALID_SIGNATURE);

  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || null;

  const order = await paymentRepository.findOrderByOrderNumber(txnRef);

  if (
    order.payment.status !== PAYMENT_STATUS.PENDING
) {
    return {
        success: order.payment.status === PAYMENT_STATUS.SUCCESS,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: order.payment.status,
        message: 'Đơn hàng đã được xử lý.'
    };
}

  if (!order) throw new Error(PAYMENT_MESSAGES.ORDER_NOT_FOUND);
  if (!order.payment) throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);
  if (Number(query.vnp_Amount) / 100 !== Number(order.totalAmount))
    throw new Error(PAYMENT_MESSAGES.INVALID_AMOUNT);

  if (order.payment.status === PAYMENT_STATUS.SUCCESS) {
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      message: PAYMENT_MESSAGES.PAYMENT_SUCCESS
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
      gatewayResponseCode: responseCode,
      paidAt: paymentStatus === PAYMENT_STATUS.SUCCESS ? new Date() : null
    }
  });

  if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
    await orderRepository.deleteCartItemsByOrder(order.id);
} else {
    await orderRepository.restoreOrderResourcesTransaction(order.id);
}

  return paymentStatus === PAYMENT_STATUS.SUCCESS
    ? {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: Number(order.totalAmount),
        paymentStatus,
        message: PAYMENT_MESSAGES.PAYMENT_SUCCESS
      }
    : {
        success: false,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus,
        gatewayResponseCode: responseCode,
        message:
          paymentStatus === PAYMENT_STATUS.CANCELLED
            ? PAYMENT_MESSAGES.PAYMENT_CANCELLED
            : PAYMENT_MESSAGES.PAYMENT_FAILED
      };
},

handleIpn: async query => {
  if (!paymentUtils.verifySecureHash(query))
    return { RspCode: '97', Message: 'Invalid Checksum' };

  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || null;
  const order = await paymentRepository.findOrderByOrderNumber(txnRef);

  if (
    order.payment.status !== PAYMENT_STATUS.PENDING
) {
    return {
        RspCode: '00',
        Message: 'Confirm Success'
    };
}

  if (!order) return { RspCode: '01', Message: 'Order not Found' };
  if (!order.payment) return { RspCode: '01', Message: 'Payment not Found' };
  if (order.payment.status === PAYMENT_STATUS.SUCCESS)
    return { RspCode: '00', Message: 'Confirm Success' };

  if (Number(query.vnp_Amount) / 100 !== Number(order.totalAmount))
    return { RspCode: '04', Message: 'Invalid Amount' };

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
      gatewayResponseCode: responseCode,
      paidAt: paymentStatus === PAYMENT_STATUS.SUCCESS ? new Date() : null
    }
  });

  if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
    await orderRepository.deleteCartItemsByOrder(order.id);
} else {
    await orderRepository.restoreOrderResourcesTransaction(order.id);
}

  return { RspCode: '00', Message: 'Confirm Success' };
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
}
};

module.exports = paymentService;
