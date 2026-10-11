const cron = require('node-cron');
const orderService = require('../modules/order/order.service');

const SHIPPING_SIMULATION_ENABLED =
  process.env.SHIPPING_SIMULATION_ENABLED?.trim().toLowerCase() === 'true';

const startShippingSimulationJob = () => {
  if (!SHIPPING_SIMULATION_ENABLED) {
    console.log(
      '[SHIPPING SIMULATION JOB] Disabled. Set SHIPPING_SIMULATION_ENABLED=true to enable.'
    );
    return;
  }

  let isRunning = false;

  cron.schedule('* * * * *', async () => {
    if (isRunning) {
      return;
    }

    isRunning = true;

    try {
      const transitionedCount =
        await orderService.advanceShippingSimulation();

      if (transitionedCount > 0) {
        console.log(
          `[SHIPPING SIMULATION JOB] Transitioned ${transitionedCount} order(s).`
        );
      }
    } catch (error) {
      console.error(
        '[SHIPPING SIMULATION JOB] Error:',
        error
      );
    } finally {
      isRunning = false;
    }
  });

  console.log(
    '[SHIPPING SIMULATION JOB] Started (every minute).'
  );
};

module.exports = {
  startShippingSimulationJob
};
