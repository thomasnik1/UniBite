const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create' , authenticateToken, requestController.createRequest);
router.put('/accept/:id', authenticateToken, requestController.acceptRequest);
router.put('/reject/:id', authenticateToken, requestController.rejectRequest);
router.put('/confirm/:id', authenticateToken,requestController.confirmPickup);
router.get('/show', authenticateToken, requestController.showPendingRequests);
router.get('/showPast', authenticateToken, requestController.showPastRequests);

module.exports = router;