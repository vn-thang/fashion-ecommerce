require('dotenv').config();
require('./config/firebase');

const http = require('http');
const app = require('./app');
const initSocket = require('./sockets/socket.server');
const redisClient = require('./config/redis');

const { startOrderExpirationJob } = require('./jobs/orderExpiration.job');
const { startFlashSaleNotificationJob } = require('./jobs/flashSaleNotification.job');
const { startCouponNotificationJob } = require('./jobs/couponNotification.job');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await redisClient.connect();

    console.log('Redis connected successfully');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      startOrderExpirationJob();
      startFlashSaleNotificationJob();
      startCouponNotificationJob();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();