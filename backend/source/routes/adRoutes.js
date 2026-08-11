const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authenticateToken  = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const adSchema = require('../validators/adSchema')

router.get('/feed', adController.getAds);

router.post(
    '/create', 
    authenticateToken,
    validateSchema(adSchema.createAdSchema),
    adController.createAd
);

router.put(
    '/edit/:id',
    validateSchema(adSchema.editAdSchema),
    authenticateToken,
    adController.editAd
);

router.delete('/delete/:id', authenticateToken, adController.deleteAd);

module.exports = router;