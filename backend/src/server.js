require('dotenv').config();

require('./config/firebase');

const app = require('./app');
const { startOrderExpirationJob } = require('./jobs/orderExpiration.job');
const { startFlashSaleNotificationJob } = require('./jobs/flashSaleNotification.job');
const { startCouponNotificationJob } = require('./jobs/couponNotification.job');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  startOrderExpirationJob();
  startFlashSaleNotificationJob();
  startCouponNotificationJob();
});