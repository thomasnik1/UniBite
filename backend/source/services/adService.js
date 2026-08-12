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
//probably need to add some checks here
    
    const newAd = await Ad.create(newAdData);

    return newAd;
};

const editAd = async (editAdData) => {

    const newEditAdData = {
        ...editAdData
    };

    const ad = await Ad.findByPk(newEditAdData.adId);

    if (!ad) {
        throw new Error('Ad not found');
    }

    if (ad.cookId !== newEditAdData.cookId) {
        throw new Error('Unauthorized to edit this ad');
    }

    //this might break right here, need to test later

    await ad.update(newEditAdData);
    return ad;
};

const deleteAd = async (deleteAdData) => {

    const newDeleteAdData = {
        ...deleteAdData
    };

    const ad = await Ad.findByPk(newDeleteAdData.adId);

    if (!ad) {
        throw new Error('Ad not found');
    }

    if (ad.cook_id !== newDeleteAdData.cookId) {
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