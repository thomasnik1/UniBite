const { Ad, Request, User, Rating } = require('../models/models');
const { Op } = require('sequelize');
const AppError = require('../utilities/AppError');

const createRating = async ({ consumerId, requestId, ratingScore}) => {
    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new AppError('Request not found', 404);
    };

    if (request.consumerId !== consumerId) {
        throw new AppError('Unauthorized to rate this request', 403);
    };

    if (request.status !== 'approved') {
        throw new AppError('Request is not approved', 400);
    };

    if (request.isPickedUp !== true) {
        throw new AppError('Request has not been picked up yet', 400);
    };

    const ad = await Ad.findByPk(request.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    const cook = await User.findByPk(ad.cookId);
    if (!cook) {
        throw new AppError('Cook not found', 404);
    };

    const existingRating = await Rating.findOne({
        where: {
            [Op.and]: [
                { consumerId: request.consumerId },
                { requestId: requestId }
            ]
        }
    });

    if (existingRating) {
        throw new AppError('You have already rated this request', 400);
    }

    const newRating = await Rating.create({
        consumerId,
        requestId,
        ratingScore
    });

    if (ratingScore <= 3 ) {
        await cook.update({ credits: cook.credits + 1 });
    };

    if (ratingScore > 3 ) {
        await cook.update({ credits: cook.credits + 2});
    };
    
    await request.update({ isRated: true });
    return newRating;
}

const editRating = async (editRatingData) => {
    
    const newEditRatingData = {
        ...editRatingData
    };

    const rating = await Rating.findByPk(newEditRatingData.ratingId);

    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumerId !== newEditRatingData.consumerId) {
        throw new Error('Unauthorized to rate this request');
    };

    const editedRating = await rating.update(newEditRatingData);

    return editedRating;
};

const deleteRating = async ({ ratingId, consumerId }) => {

    const rating = await Rating.findByPk(ratingId);

    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumerId !== consumerId) {
        throw new Error('Unauthorized to delete this request');
    };    

    const deleteRating = await rating.destroy();
};

module.exports = {
    createRating,
    editRating,
    deleteRating
};