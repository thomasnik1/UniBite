const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/feed', adController.getAds);
router.post('/create', authenticateToken, adController.createAd);

module.exports = router;