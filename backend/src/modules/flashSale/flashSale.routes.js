const express = require('express');
const router = express.Router();

const flashSaleController = require('./flashSale.controller');
const flashSaleValidation = require('./flashSale.validation');

const flashSaleVariantController = require('./flashSaleVariant.controller');
const flashSaleVariantValidation = require('./flashSaleVariant.validation');

router.post(
  '/',
  flashSaleValidation.validateCreate,
  flashSaleController.create
);

router.get(
  '/',
  flashSaleController.getAll
);

router.get(
  '/active',
  flashSaleController.getActive
);

router.get(
  '/customer',
  flashSaleController.getCustomerFlashSale
);

router.get(
  '/:id',
  flashSaleValidation.validateDelete,
  flashSaleController.getById
);

router.put(
  '/:id',
  flashSaleValidation.validateUpdate,
  flashSaleController.update
);

router.delete(
  '/:id',
  flashSaleValidation.validateDelete,
  flashSaleController.disable
);


router.get(
    '/:flashSaleId/variants/available',
    flashSaleVariantValidation.validateFlashSaleId,
    flashSaleVariantValidation.validateAvailable,
    flashSaleVariantController.getAvailableVariants
);

router.get(
  '/:flashSaleId/variants',
  flashSaleVariantValidation.validateFlashSaleId,
  flashSaleVariantController.getAll
);

router.get(
  '/variants/:id',
  flashSaleVariantValidation.validateId,
  flashSaleVariantController.getById
);

router.post(
  '/:flashSaleId/variants',
  flashSaleVariantValidation.validateCreate,
  flashSaleVariantController.addVariants
);

router.put(
  '/variants/:id',
  flashSaleVariantValidation.validateUpdate,
  flashSaleVariantController.update
);

router.delete(
  '/variants/:id',
  flashSaleVariantValidation.validateId,
  flashSaleVariantController.remove
);

module.exports = router;