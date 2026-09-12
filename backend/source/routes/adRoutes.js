const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authenticateToken  = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const { createAdSchema, editAdSchema, deleteAdSchema } = require('../validators/adSchema')

router.get('/feed', adController.getAllActiveAds);

router.post(
    '/create', 
    authenticateToken,
    validateSchema(createAdSchema, 'body'),
    adController.createAd
);

router.patch(
    '/edit/:id',
    validateSchema(editAdSchema, 'body'),
    authenticateToken,
    adController.editAd
);

router.delete(
    '/delete/:id',
    authenticateToken, 
    validateSchema(deleteAdSchema, 'params'),
    adController.deleteAd
);

router.get(
    '/my-ads',
    authenticateToken,
    adController.getMyAds
);

router.get(
    '/my-ads/:id',
    authenticateToken,
    adController.getMyAdById
)

module.exports = router;