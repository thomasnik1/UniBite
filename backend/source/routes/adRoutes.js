const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authenticateToken  = require('../middlewares/authMiddleware');

router.get('/feed', adController.getAds);
router.post('/create', authenticateToken, adController.createAd);
router.put('/edit/:id', authenticateToken, adController.editAd);
router.delete('/delete/:id', authenticateToken, adController.deleteAd);

module.exports = router;