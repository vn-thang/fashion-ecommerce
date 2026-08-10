const express = require('express');

const router = express.Router();

const dashboardController = require('./dashboard.controller');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

const {
  validateDashboardFilter
} = require('./dashboard.validation');

router.use(authenticate);
router.use(authorize('Admin'));

router.get(
  '/',
  validateDashboardFilter,
  dashboardController.getDashboard
);

module.exports = router;