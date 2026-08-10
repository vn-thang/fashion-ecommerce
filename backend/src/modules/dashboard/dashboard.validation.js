const {
  DASHBOARD_MESSAGES,
  DASHBOARD_PERIOD
} = require('./dashboard.constants');

const dashboardValidation = {
  validateDashboardFilter(req, res, next) {
    const {
      period,
      range,
      startDate,
      endDate
    } = req.query;

    const filterPeriod = period || range;

    const validPeriods = Object.values(DASHBOARD_PERIOD);

    if (
      filterPeriod &&
      !validPeriods.includes(filterPeriod)
    ) {
      return res.status(400).json({
        success: false,
        message: DASHBOARD_MESSAGES.INVALID_DATE
      });
    }

    if (
      filterPeriod === DASHBOARD_PERIOD.CUSTOM
    ) {
      if (!startDate) {
        return res.status(400).json({
          success: false,
          message:
            DASHBOARD_MESSAGES.START_DATE_REQUIRED
        });
      }

      if (!endDate) {
        return res.status(400).json({
          success: false,
          message:
            DASHBOARD_MESSAGES.END_DATE_REQUIRED
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        return res.status(400).json({
          success: false,
          message:
            DASHBOARD_MESSAGES.INVALID_DATE
        });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message:
            DASHBOARD_MESSAGES.START_DATE_AFTER_END_DATE
        });
      }
    }

    next();
  }
};

module.exports = dashboardValidation;