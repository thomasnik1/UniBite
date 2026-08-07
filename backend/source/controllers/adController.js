const adService = require('../services/adService');

const getAds = async (req, res) => {
    try {
        const ads = await adService.getAllActiveAds();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία λήψης αγγελιών', message: error.message });
    }
};

const createAd = async (req, res) => {
    try {
        const cookId = req.user.userId; // Assuming the user ID is available in the request object after authentication
        const adData = {
            cook_Id: cookId,
            ...req.body
        };
         // Assuming the user ID is available in the request object after authentication
        const newAd = await adService.createAd(adData);
        res.status(201).json({ message: 'Η αγγελία δημιουργήθηκε!', ad: newAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας αγγελίας', message: error.message });
    }
};

const editAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const cookId = req.user.userId;
        const adData = req.body;

        const editAd = await adService.editAd(adId, cookId, adData);
        res.status(200).json({ message: 'Η αγγελία ενημερώθηκε!', ad: editAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία ενημέρωσης αγγελίας', message: error.message });
    }
};

const deleteAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const cookId = req.user.userId;

        const deleteAD = await adService.deleteAd(adId, cookId);
        res.status(200).json({message: 'Η αγγελία διαγράφηκε!', ad: deleteAD});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία διαγραφής αγγελίας', message: error.message });
    }
    
};

module.exports = {
    getAds,
    createAd,
    editAd,
    deleteAd
};