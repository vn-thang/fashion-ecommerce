const couponService = require(
  '../modules/coupon/coupon.service'
);

const COUPON_CHECK_INTERVAL = 30 * 1000;

let intervalId = null;

const startCouponNotificationJob = () => {
  if (intervalId) {
    return;
  }

  console.log(
    '[COUPON JOB] Started'
  );

  intervalId = setInterval(async () => {
    try {
      await couponService.sendCouponNotifications();
    } catch (error) {
      console.error(
        '[COUPON JOB] Error:',
        error
      );
    }
  }, COUPON_CHECK_INTERVAL);
};

module.exports = {
  startCouponNotificationJob
};