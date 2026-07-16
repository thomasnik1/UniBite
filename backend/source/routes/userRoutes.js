const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.post('/authenticate', userController.authenticateUser);

module.exports = router;