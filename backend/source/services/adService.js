const Ad = require('../models/Ad');
const { Op } = require('sequelize');

const getAllActiveAds = async () => {
    // Φέρνει όλες τις αγγελίες με status 'active'
    return await Ad.findAll({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
    });
};

const createAd = async (adData) => {
    const newadData = {
        ...adData
    }
    
    const newAd = await Ad.create({
        cook_id: newadData.cook_Id,
        title: newadData.title,
        description: newadData.description,
        allergens: newadData.allergens,
        portions: newadData.portions,
        pickup_location: newadData.pickup_location,
        pickup_time: newadData.pickup_time
    });

    return {
        newAd: {
            id: newAd.id,
            cook_id: newAd.cook_id,
            title: newAd.title,
            description: newAd.description,
            allergens: newAd.allergens,
            portions: newAd.portions,
            pickup_location: newAd.pickup_location,
            pickup_time: newAd.pickup_time,
            status: newAd.status
        }
    };
};

const editAd = async (adId,cookId, adData) => {
    const ad = await Ad.findByPk(adId);

    if (!ad) {
        throw new Error('Ad not found');
    }

    if (ad.cook_id !== cookId) {
        throw new Error('Unauthorized to edit this ad');
    }

    await ad.update(adData);
    return ad;
}

const deleteAd = async (adId, cookId) => {
    const ad = await Ad.findByPk(adId);

    if (!ad) {
        throw new Error('Ad not found');
    }

    if (ad.cook_id !== cookId) {
        throw new Error('Unauthorized to delete this ad');
    }

    await ad.update({ status: 'deleted' });
    return ad;
}

const deleteExpiredAds = async() => {
    try {
        const expirationDate = new Date();
        expirationDate.setHours = (expirationDate.getHours() - 48);

        const expiredAds = await Ad.update(
            { status: 'deleted' },
            {
                where: {
                    created_at: {
                        [Op.lt]: expirationDate
                    },
                    status: 'active'
                }
            }
        );
    } catch (error) {
        console.error('Error deleting expired ads:', error);
    }
}

module.exports = {
    getAllActiveAds,
    createAd,
    editAd,
    deleteAd,
    deleteExpiredAds
};