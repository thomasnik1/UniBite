const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const requestSchema = require('../validators/requestSchema');

router.post('/create' ,
    authenticateToken,
    validateSchema(requestSchema.createRequestSchema, 'body'),
    requestController.createRequest
);

router.put(
    '/accept/:id',
    authenticateToken, 
    validateSchema(requestSchema.acceptRequestSchema, 'params'),
    requestController.acceptRequest
);

router.put(
    '/reject/:id',
    authenticateToken,
    validateSchema(requestSchema.rejectRequestSchema, 'params'),
    requestController.rejectRequest
);

router.put(
    '/report/:id',
    authenticateToken,
    validateSchema(requestSchema.reportNoShowSchema, 'params'),
    requestController.reportNoShow
);

router.put(
    '/confirm/:id',
    authenticateToken,
    validateSchema(requestSchema.confirmPickupIdSchema, 'params'),
    requestController.confirmPickup
);

router.get('/show', authenticateToken, requestController.showPendingRequests);
router.get('/showPast', authenticateToken, requestController.showPastRequests);
router.get('/pending-count', authenticateToken, requestController.getPendingRequestCount);

router.get ('/incoming', authenticateToken, requestController.showIncomingRequests);
router.get ('/outgoing', authenticateToken, requestController.showOutgoingRequests);

module.exports = router;