const { Ad, Request, User, Rating } = require('../models/models');
const { Op } = require('sequelize');
const AppError = require('../utilities/AppError');

const createRating = async ({ consumerId, requestId, ratingScore}) => {
    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new Error('Request not found');
    };

    if (request.consumerId !== consumerId) {
        throw new Error('Unauthorized to rate this request');
    };

    if (request.status !== 'approved') {
        throw new Error('Request is not approved');
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
        throw new Error('You have already rated this request');
    }

    const newRating = await Rating.create({
        consumerId,
        requestId,
        ratingScore
    });

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

    if (rating.consumerId !== newEditRatingData.raterId) {
        throw new Error('Unauthorized to rate this request');
    };

    const editedRating = await rating.update(newEditRatingData);

    return editedRating;
};

const deleteRating = async ({ ratingId, raterId }) => {

    const rating = await Rating.findByPk(ratingId);

    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumerId !== raterId) {
        throw new Error('Unauthorized to delete this request');
    };    

    const deleteRating = await rating.destroy();
}

module.exports = {
    createRating,
    editRating,
    deleteRating
};