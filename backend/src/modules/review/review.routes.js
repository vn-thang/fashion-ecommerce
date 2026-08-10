const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const reviewValidation = require('./review.validation');
const authenticate = require('../../middlewares/auth.middleware');

router.get('/product/:productId', reviewValidation.validateProductId, reviewController.getProductReviews);

router.use(authenticate);

router.post('/create', reviewValidation.validateCreateReview, reviewController.createReview);

module.exports = router;