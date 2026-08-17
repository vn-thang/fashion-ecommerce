const flashSaleService = require(
  '../modules/flashSale/flashSale.service'
);

const FLASH_SALE_CHECK_INTERVAL = 30 * 1000;

let intervalId = null;

const startFlashSaleNotificationJob = () => {
  if (intervalId) {
    return;
  }

  console.log(
    '[FLASH SALE JOB] Started'
  );

  intervalId = setInterval(async () => {
    try {
      await flashSaleService.sendFlashSaleNotifications();
    } catch (error) {
      console.error(
        '[FLASH SALE JOB] Error:',
        error
      );
    }
  }, FLASH_SALE_CHECK_INTERVAL);
};

module.exports = {
  startFlashSaleNotificationJob
};