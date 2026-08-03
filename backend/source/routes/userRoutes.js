const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);
router.post('/refresh', userController.refreshToken);

module.exports = router;