const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create' , authenticateToken, requestController.createRequest);

module.exports = router;