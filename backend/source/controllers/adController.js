const adService = require('../services/adService');

const getAds = async (req, res) => {
    try {
        const ads = await adService.getAllActiveAds();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία λήψης αγγελιών' });
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
        res.status(500).json({ error: 'Αποτυχία δημιουργίας αγγελίας' });
    }
};

const editAd = async (req, res) => {
    try {
        const adId = req.params.id;
        console.log('Ad ID:', adId); // Log the adId to verify it's being received correctly
        const cookId = req.user.userId;
        const adData = req.body;

        const editAd = await adService.editAd(adId, cookId, adData);
        res.status(200).json({ message: 'Η αγγελία ενημερώθηκε!', ad: editAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία ενημέρωσης αγγελίας' });
    }
};

module.exports = {
    getAds,
    createAd,
    editAd
};