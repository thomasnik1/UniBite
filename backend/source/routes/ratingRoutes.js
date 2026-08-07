const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post ('/create', authenticateToken, ratingController.createRating);

module.exports = router;