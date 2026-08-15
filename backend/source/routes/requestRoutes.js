const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const requestSchema = require('../validators/requestSchema');

router.post('/create' ,
    validateSchema(requestSchema.createRequestSchema),
    authenticateToken,
    requestController.createRequest
);

router.put(
    '/accept/:id',
    validateSchema(requestSchema.acceptRequestSchema),
    authenticateToken, 
    requestController.acceptRequest
);

router.put(
    '/reject/:id',
    validateSchema(requestSchema.rejectRequestSchema),
    authenticateToken,
    requestController.rejectRequest
);

router.put(
    '/confirm/:id',
    validateSchema(requestSchema.confirmPickupSchema),
    authenticateToken,
    requestController.confirmPickup
);

router.put(
    '/report/:id',
    validateSchema(requestSchema.reportNoShowSchema),
    authenticateToken,
    requestController.reportNoShow
);

router.get('/show', authenticateToken, requestController.showPendingRequests);
router.get('/showPast', authenticateToken, requestController.showPastRequests);

module.exports = router;