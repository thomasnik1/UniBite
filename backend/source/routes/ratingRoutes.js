const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } =require('../middlewares/validatorMiddleware');
const { createRatingSchema, editRatingSchema, deleteRatingSchema } = require('../validators/ratingSchema')

router.post(
    '/create',
    authenticateToken,
    validateSchema(createRatingSchema),
    ratingController.createRating
);

router.patch(
    '/edit/:id',
    authenticateToken,
    validateSchema(editRatingSchema),
    ratingController.editRating
);

router.delete(
    '/delete/:id',
    authenticateToken,
    validateSchema(deleteRatingSchema),
    ratingController.deleteRating
);

module.exports = router;