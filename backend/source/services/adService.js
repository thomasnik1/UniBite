const { Ad, Request, User } = require('../models/models');
const { Op } = require('sequelize');
const AppError = require('../utilities/AppError');

const getAllAds = async () => {
    return await Ad.findAll({
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

const deleteAd = async ({ adId, cookId }) => {
    const ad = await Ad.findByPk(adId);

    if (!ad) {
        throw new Error('Ad not found');
    };

    if (ad.cookId !== cookId) {
        throw new Error('Unauthorized to delete this ad');
    };

    if (ad.status === 'deleted') {
        throw new Error('Ad is already deleted');
    };

    const requests = await Request.findAll({
        where: {
            adId: adId,
            status: {
                [Op.in]: ['pending', 'approved']
            }
        }
    });

    if (requests.length > 0) {
        requests.forEach( async (request) => {
            await Request.update({ status: 'rejected' }, { where: { id: request.id } });
            const consumer = await User.findByPk(request.consumerId);
            if (consumer) {
                await consumer.update({ credits: consumer.credits + request.portions });
            };
        });
    };

    await ad.update({ status: 'deleted' });
    return ad;
};

const getMyAds = async (cookId) => {

    const myAds = await Ad.findAll({
        where: {cookId: cookId}
    });

    return myAds;
};

const getMyAdById = async (cookId, adId) => {

    const cook = await User.findByPk(cookId);
    if (!cook) {
        throw new Error('Cook not found');
    };

    const myAd = await Ad.findOne({
        where: {
            id: adId,
            cookId: cookId
        }
    });

    return myAd;
};

module.exports = {
    getAllAds,
    createAd,
    editAd,
    deleteAd,
    getMyAds,
    getMyAdById
};