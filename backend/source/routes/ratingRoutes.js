const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } =require('../middlewares/validatorMiddleware');
const { createRatingSchema } = require('../validators/ratingSchema')

router.post(
    '/create',
    authenticateToken,
    validateSchema(createRatingSchema, 'body'),
    ratingController.createRating
);

module.exports = router;