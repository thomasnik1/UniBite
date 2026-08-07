const requestService = require('../services/requestService');

const createRequest = async (req, res) => {
    try {
        const request = await requestService.createRequest({
            userId: req.user.userId,
            adId: req.body.adId,
            portions: req.body.portions
        });
        res.status(201).json({ message: 'Η αίτηση δημιουργήθηκε!', request: request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αίτησης', error: error.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const request = req.params.id
        const result = await requestService.acceptRequest(request);
        res.status(200).json({ message: 'Η αίτηση έγινε αποδεκτή!', request: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την αποδοχή της αίτησης', error: error.message });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const request = req.params.id;
        const result = await requestService.rejectRequest(request);
        res.status(200).json({ message: 'Η αίτηση απορρίφθηκε!', request: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την απόρριψη της αίτησης', error: error.message });
    }
};

module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest
};          