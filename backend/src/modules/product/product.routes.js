const express = require('express');
const router = express.Router();

const productController = require('./product.controller');
const productValidation = require('./product.validation');

router.get(
'/',
productController.getAll
);

router.get(
'/detail/:slug',
productController.getBySlug
);

router.get(
'/best-selling',
productController.getBestSellingProducts
);

router.get(
'/newest',
productController.getNewestProducts
);

router.get(
'/:id/related',
productValidation.validateId,
productController.getRelatedProducts
);

router.get(
'/:id',
productValidation.validateId,
productController.getByIdClient
);

module.exports = router;
