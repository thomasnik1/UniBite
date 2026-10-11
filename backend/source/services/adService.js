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
    
    const newAd = await Ad.create(newAdData);

    return newAd;
};

const editAd = async (editAdData) => {

    const newEditAdData = {
        ...editAdData
    };

    const ad = await Ad.findByPk(newEditAdData.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (ad.cookId !== newEditAdData.cookId) {
        throw new AppError('Unauthorized to edit this ad', 403);
    };

    await ad.update(newEditAdData);
    return ad;
};

const deleteAd = async ({ adId, cookId }) => {
    const ad = await Ad.findByPk(adId);

    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (ad.cookId !== cookId) {
        throw new AppError('Unauthorized to delete this ad', 403);
    };

    if (ad.status === 'deleted') {
        throw new AppError('Ad is already deleted', 400);
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
        for (const request of requests) {
            await Request.update({ status: 'rejected' }, { where: { id: request.id } });
            const consumer = await User.findByPk(request.consumerId);
            if (consumer) {
                await consumer.update({ credits: consumer.credits + request.portions });
            };
        };
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
        throw new AppError('Cook not found', 404);
    };

    const myAd = await Ad.findOne({
        where: {
            id: adId,
            cookId: cookId
        }
    });

    if (!myAd) {
        throw new AppError('Ad not found', 404);
    };
    
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