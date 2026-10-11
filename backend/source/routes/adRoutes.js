const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authenticateToken  = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const { createAdSchema, editAdSchema, deleteAdSchema } = require('../validators/adSchema')
const upload = require('../middlewares/uploadMiddleware');

router.get('/feed', adController.getAllAds);

router.post(
    '/create',
    authenticateToken,
    upload.single('image'),
    validateSchema(createAdSchema, 'body'),
    adController.createAd
);

router.patch(
    '/edit/:id',
    authenticateToken,
    upload.single('image'),
    validateSchema(editAdSchema, 'body'),
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