const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } = require ('../middlewares/validatorMiddleware');
const { createUserSchema, loginUserSchema } = require('../validators/userSchema');

router.post('/create', validateSchema(createUserSchema, 'body'), userController.createUser);
router.post('/login', validateSchema(loginUserSchema, 'body'), userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);
router.post('/refresh', userController.refreshToken);

module.exports = router;