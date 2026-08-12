const { Ad, Request, User } = require('../models/models');
const { Op } = require('sequelize');

const getAllActiveAds = async () => {
    return await Ad.findAll({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
    });
};

const createAd = async (adData) => {
    const newAdData = {
        ...adData
    }
    
    const newAd = await Ad.create({
        cookId: newAdData.cookId,
        title: newAdData.title,
        description: newAdData.description,
        allergens: newAdData.allergens,
        portions: newAdData.portions,
        pickupLocation: newAdData.pickupLocation,
        pickupTime: newAdData.pickupTime
    });

    return {
        newAd: {
            id: newAd.id,
            cookId: newAd.cookId,
            title: newAd.title,
            description: newAd.description,
            allergens: newAd.allergens,
            portions: newAd.portions,
            pickupLocation: newAd.pickupLocation,
            pickupTime: newAd.pickupTime,
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
};

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
};

const deleteExpiredAds = async() => {

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() - 48);

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
    console.log(`Deleted ${expiredAds[0]} expired ads.`);

};

module.exports = {
    getAllActiveAds,
    createAd,
    editAd,
    deleteAd,
    deleteExpiredAds
};