const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } = require('../middlewares/validatorMiddleware');
const requestSchema = require('../validators/requestSchema');

router.post('/create' ,
    validateSchema(requestSchema.createRequestSchema, 'body'),
    authenticateToken,
    requestController.createRequest
);

router.put(
    '/accept/:id',
    validateSchema(requestSchema.acceptRequestSchema, 'params'),
    authenticateToken, 
    requestController.acceptRequest
);

router.put(
    '/reject/:id',
    validateSchema(requestSchema.rejectRequestSchema, 'params'),
    authenticateToken,
    requestController.rejectRequest
);


router.put(
    '/report/:id',
    validateSchema(requestSchema.reportNoShowSchema, 'body'),
    authenticateToken,
    requestController.reportNoShow
);

router.put(
    '/confirm/:id',
    validateSchema(requestSchema.confirmPickupIdSchema, 'params'),
    validateSchema(requestSchema.confirmPickupAdIdSchema, 'body '),
    authenticateToken,
    requestController.confirmPickup
);

router.get('/show', authenticateToken, requestController.showPendingRequests);
router.get('/showPast', authenticateToken, requestController.showPastRequests);
router.get('/pending-count', authenticateToken, requestController.getPendingRequestCount);

router.get ('/incoming', authenticateToken, requestController.showIncomingRequests);
router.get ('/outgoing', authenticateToken, requestController.showOutgoingRequests);

module.exports = router;