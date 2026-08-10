const express = require('express');
const router = express.Router();

const reviewAdminController = require('./review.admin.controller');

const authenticate = require('../../../middlewares/auth.middleware');
const checkRole = require('../../../middlewares/role.middleware');

router.use(authenticate);
router.use(checkRole('ADMIN', 'SUPER_ADMIN'));

router.get('/', reviewAdminController.getAllReviews);
router.post('/:id/reply', reviewAdminController.replyReview);
router.patch('/:id/hide', reviewAdminController.hideReview);
router.patch('/:id/restore', reviewAdminController.restoreReview);

module.exports = router;