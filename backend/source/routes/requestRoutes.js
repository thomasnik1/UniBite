const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/' , authenticateToken, requestController.createRequests);

module.exports = router;