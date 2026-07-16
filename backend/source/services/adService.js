const Ad = require('../models/Ad');

const getAllActiveAds = async () => {
    // Φέρνει όλες τις αγγελίες με status 'active'
    return await Ad.findAll({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
    });
};

const createAd = async (adData) => {
    // Δημιουργεί μια νέα αγγελία στη βάση
    return await Ad.create(adData);
};

module.exports = {
    getAllActiveAds,
    createAd
};