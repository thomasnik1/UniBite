const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Υποθέτουμε ότι υπάρχει ένα middleware για έλεγχο JWT
const isAdmin = require('../middlewares/isAdminMiddleware'); // Το middleware που συζητήσαμε πριν

router.use(authenticateToken, isAdmin);

router.get('/stats/portions-last-month', adminController.getPortionsLastMonth);
router.get('/stats/top-donor', adminController.getTopDonor);
router.get('/stats/top-meals', adminController.getTopMeals);

module.exports = router;