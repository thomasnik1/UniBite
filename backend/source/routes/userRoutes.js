const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateSchema } = require ('../middlewares/validatorMiddleware');
const userSchema = require('../validators/userSchema');

router.post('/create', validateSchema(userSchema.createUserSchema), userController.createUser);
router.post('/login', validateSchema(userSchema.loginUserSchema), userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);
router.post('/refresh', userController.refreshToken);

module.exports = router;