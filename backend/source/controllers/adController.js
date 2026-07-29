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
            ...req.body,
            cook_Id: cookId
        };
         // Assuming the user ID is available in the request object after authentication
        const newAd = await adService.createAd(adData);
        res.status(201).json({ message: 'Η αγγελία δημιουργήθηκε!', ad: newAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας αγγελίας' });
    }
};

module.exports = {
    getAds,
    createAd
};