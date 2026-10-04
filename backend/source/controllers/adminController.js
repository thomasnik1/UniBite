const adminService = require('../services/adminService');

const getPortionsLastMonth = async (req, res) => {
    try {
        const totalPortions = await adminService.calculatePortionsLastMonth();
        res.status(200).json({ totalPortions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά τον υπολογισμό μερίδων', error: error.message });
    }
};

const getTopDonor = async (req, res) => {
    try {
        const topDonor = await adminService.findTopDonor();
        res.status(200).json({ topDonor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την εύρεση του κορυφαίου δωρητή', error: error.message });
    }
};

const getTopMeals = async (req, res) => {
    try {
        const topMeals = await adminService.findTopMeals();
        res.status(200).json({ topMeals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την εύρεση των κορυφαίων γευμάτων', error: error.message });
    }
};

module.exports = {
    getPortionsLastMonth,
    getTopDonor,
    getTopMeals
};