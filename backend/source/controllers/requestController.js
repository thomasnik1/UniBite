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

const acceptRequest = async (req, res) => {
    try {
        const result = await requestService.acceptRequest({
            requestId: req.params.id,
        });
        res.status(200).json({ message: 'Η αίτηση έγινε αποδεκτή!', request: result });
    } catch (error) {
        res.status(500).json({ message: 'Σφάλμα κατά την αποδοχή της αίτησης', error: error });
    }
};
const rejectRequest = async (req, res) => {
    try {
        const result = await requestService.rejectRequest({
            rwquestId: req.params.id,
            
        })
    }
}

const
module.exports = {
    createRequest,
    acceptRequest
};          