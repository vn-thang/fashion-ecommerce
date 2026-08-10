const express = require('express');
const router = express.Router();

const inventoryController = require('./inventory.controller');
const inventoryValidation = require('./inventory.validation');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(authenticate);
router.use(authorize('Admin'));

router.get(
  '/',
  inventoryController.getTransactions
);

router.get(
  '/variants',
  inventoryController.getVariants
);

router.get(
  '/:id',
  inventoryController.getTransactionDetail
);

router.post(
  '/import',
  inventoryValidation.validateImport,
  inventoryController.importStock
);

router.post(
  '/adjust',
  inventoryValidation.validateAdjustment,
  inventoryController.adjustStock
);

module.exports = router;