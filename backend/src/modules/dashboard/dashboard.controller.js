const dashboardService = require('./dashboard.service');
const { DASHBOARD_MESSAGES } = require('./dashboard.constants');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const data = await dashboardService.getDashboard(
        req.query
      );

      return res.status(200).json({
        success: true,
        message: DASHBOARD_MESSAGES.GET_SUCCESS,
        data
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = dashboardController;