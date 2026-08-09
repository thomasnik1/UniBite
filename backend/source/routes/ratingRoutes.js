const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post ('/create', authenticateToken, ratingController.createRating);
router.put('/edit', authenticateToken, ratingController.editRating);
//router.delete('/delete', authenticateToken, ratingController.deleteRating);

module.exports = router;