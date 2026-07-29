const Ad = require('../models/Ad');

const getAllActiveAds = async () => {
    // Φέρνει όλες τις αγγελίες με status 'active'
    return await Ad.findAll({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
    });
};

const createAd = async (adData, userId) => {

    const newadData = {
        cook_Id: userId,
        ...adData
    }
    const newAd = await Ad.create(newadData);
    return newAd;
};

module.exports = {
    getAllActiveAds,
    createAd
};