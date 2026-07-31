const requestService = require('../services/requestService');

const createRequest = async (req, res) => {
    try {
        const request = await requestService.createRequest({
            userId: req.user.userId,
            adId: req.body.adId
        });
        res.status(201).json({ message: 'Η αίτηση δημιουργήθηκε!', request: request });
    } catch (error) {
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αίτησης', error: error });
    }
};

module.exports = {
    createRequest
};