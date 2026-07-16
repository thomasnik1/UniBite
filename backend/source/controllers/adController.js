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
        const newAd = await adService.createAd(req.body);
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