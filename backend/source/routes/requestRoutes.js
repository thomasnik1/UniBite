const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create' , authenticateToken, requestController.createRequest);
router.put('/accept/:id', authenticateToken, requestController.acceptRequest);
router.put('/reject/:id', authenticateToken, requestController.rejectRequest);
router.put('/confirm', authenticateToken,requestController.confirmPickup);

module.exports = router;