const paymentService = require('./payment.service');

const {
  sendSuccess,
  sendError
} = require('../../utils/response');

const paymentController = {

  createPaymentUrl: async (req, res) => {
  //    console.log('[VNPAY CONTROLLER] called', {
  //   body: req.body
  // });
  //   try {
  //     const { orderId } = req.body;

  //     const ipAddress =
  //       req.headers['x-forwarded-for'] ||
  //       req.socket.remoteAddress ||
  //       req.ip;

  //     const result =
  //       await paymentService.createPaymentUrl({
  //         orderId,
  //         ipAddress
  //       });

  //     return sendSuccess(
  //       res,
  //       200,
  //       'Tạo URL thanh toán thành công.',
  //       result
  //     );
  //   } catch (err) {
  //      console.error('[VNPAY CONTROLLER ERROR]', {
  //     message: err.message,
  //     stack: err.stack
  //   });
  //     return sendError(
  //       res,
  //       400,
  //       err.message
  //     );
  //   }

   console.log('========== VNPAY TEST 999 ==========');

  return res.status(200).json({
    success: true,
    test: 'RENDER-VNPAY-999',
    time: new Date().toISOString()
  });
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