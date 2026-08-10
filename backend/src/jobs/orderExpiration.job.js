const cron = require('node-cron');
const orderService = require('../modules/order/order.service');

const startOrderExpirationJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      await orderService.cancelExpiredPendingOrders();
    } catch (err) {
      console.error(
        '[ORDER EXPIRATION JOB]',
        err.message
      );
    }
  });

  console.log(
    'Order expiration job started (every 1 minute).'
  );
};

module.exports = {
  startOrderExpirationJob
};