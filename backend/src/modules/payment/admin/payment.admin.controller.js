const paymentService = require('../payment.service');

const {
  PAYMENT_MESSAGES
} = require('../payment.constants');

const {
  sendSuccess,
  sendError
} = require('../../../utils/response');

const paymentAdminController = {
  getPayments: async (req, res) => {
    try {
      const result =
        await paymentService.getPayments(
          req.query
        );

      return sendSuccess(
        res,
        200,
        PAYMENT_MESSAGES.GET_PAYMENTS_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  getPaymentDetail: async (req, res) => {
    try {
      const result =
        await paymentService.getPaymentDetail(
          req.params.id
        );

      return sendSuccess(
        res,
        200,
        PAYMENT_MESSAGES.GET_PAYMENT_DETAIL_SUCCESS,
        result
      );
    } catch (err) {
      return sendError(
        res,
        404,
        err.message
      );
    }
  }
};

module.exports = paymentAdminController;