const requestService = require('../services/requestService');

const createRequest = async (req, res) => {
    try {
        const request = await requestService.createRequest({
            consumerId: req.user.userId,
            ...req.body
        });
        res.status(201).json({ message: 'Η αίτηση δημιουργήθηκε!', request: request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αίτησης', error: error.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const acceptRequestData = {
            requestId: req.params.id,
            cookId: req.user.userId
        };

        const result = await requestService.acceptRequest(acceptRequestData);
        res.status(200).json({ message: 'Η αίτηση έγινε αποδεκτή!', request: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την αποδοχή της αίτησης', error: error.message });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const rejectRequestData = {
            requestId: req.params.id,
            cookId: req.user.userId
        };

        const result = await requestService.rejectRequest(rejectRequestData);
        res.status(200).json({ message: 'Η αίτηση απορρίφθηκε!', request: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά την απόρριψη της αίτησης', error: error.message });
    }
};

const confirmPickup = async (req, res) => {
    try {
        const confirmPickupData = {
            cookId: req.user.userId,
            requestId: req.params.id,
            adId: req.body.adId
        };

        const result = await requestService.confirmPickup(confirmPickupData);
        res.status(200).json({ message: 'Η μεριδα παρεληφθη επιτυχως', request: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ' Αποτυχια κατα την επιβεβαιωση παραλαβης', error: error.message});
    }
};

const showPendingRequests = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await requestService.showPendingRequests(userId);
        res.status(200).json({ message: 'Pending requests', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load requests', error: error.message })
    }

};

const showPastRequests = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await requestService.showPastRequests(userId);
        res.status(200).json({ message: 'Past requests', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load past requests', error: error.message })
    }

};
module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest,
    confirmPickup,
    showPendingRequests,
    showPastRequests
};          