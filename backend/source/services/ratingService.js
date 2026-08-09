const Ad = require('../models/Ad');
const Rating = require('../models/Rating');
const Request = require('../models/Request');
const User =  require('../models/User');
const { Op } = require('sequelize');

const createRating = async (ratingData) => {
    const { consumer_id, request_id, rating_score } = ratingData;

    const request = await Request.findByPk(request_id);
    if (!request) {
        throw new Error('Request not found');
    };

    if (request.consumer_id !== consumer_id) {
        throw new Error('Unauthorized to rate this request');
    };

    if (request.status !== 'approved') {
        throw new Error('Request is not approved');
    };

    const existingRating = await Rating.findOne({
        where: {
            [Op.and]: [
                { consumer_id: request.consumer_id },
                { request_id: request_id }
            ]
        }
    });

    if (existingRating) {
        throw new Error('You have already rated this request');
    }

    const newRating = await Rating.create({
        consumer_id,
        request_id,
        rating_score
    });

    return newRating;
}

const editrating = async (ratingData) => {
    const { consumer_id, rating_id, rating_score } = ratingData;
    const rating = await Rating.findByPk(rating_id);

    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumer_id !== consumer_id) {
        throw new Error('Unauthorized to rate this request');
    };

    const editedRating = await Rating.update(ratingData);

    return editedRating;
};

module.exports = {
    createRating,
    editrating
};