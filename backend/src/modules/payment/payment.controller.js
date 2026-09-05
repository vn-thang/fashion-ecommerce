const paymentService = require('./payment.service');

const {
  sendSuccess,
  sendError
} = require('../../utils/response');

const paymentController = {

  createPaymentUrl: async (req, res) => {
    try {
      const { orderId } = req.body;

const forwardedFor = req.headers['x-forwarded-for'];

const ipAddress = forwardedFor
  ? forwardedFor.split(',')[0].trim()
  : req.socket.remoteAddress || req.ip;

      const result =
        await paymentService.createPaymentUrl({
          orderId,
          ipAddress
        });

      return sendSuccess(
        res,
        200,
        'Tạo URL thanh toán thành công.',
        result
      );
    } catch (err) {
       console.error('[VNPAY CONTROLLER ERROR]', {
      message: err.message,
      stack: err.stack
    });
      return sendError(
        res,
        400,
        err.message
      );
    }
  },

  handleReturn: async (req, res) => {
    try {
      const result =
        await paymentService.handleReturn(
          req.query
        );

      return sendSuccess(
        res,
        200,
        result.message,
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

  handleIpn: async (req, res) => {
    try {
      const result =
        await paymentService.handleIpn(
          req.query
        );

      return res.status(200).json(result);
    } catch (err) {
      return res.status(200).json({
        RspCode: '99',
        Message: err.message
      });
    }
  }
};

module.exports = paymentController;