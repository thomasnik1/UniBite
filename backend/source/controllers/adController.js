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
        const adData = {
            cookId: req.user.userId,
            ...req.body
        };

        const newAd = await adService.createAd(adData);
        res.status(201).json({ message: 'Η αγγελία δημιουργήθηκε!', ad: newAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας αγγελίας', message: error.message });
    }
};

const editAd = async (req, res) => {
    try {
        const editAdData = {
            adId: req.params.id,
            cookId: req.user.userId,
            ...req.body
        };

        const editAd = await adService.editAd(editAdData);
        res.status(200).json({ message: 'Η αγγελία ενημερώθηκε!', ad: editAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία ενημέρωσης αγγελίας', message: error.message });
    }
};

const deleteAd = async (req, res) => {
    try {
        const deleteAdData = {
            adId: req.params.id,
            cookId: req.user.userId
        };
        
        const result = await adService.deleteAd(deleteAdData);
        res.status(200).json({message: 'Η αγγελία διαγράφηκε!', ad: deleteAd});
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