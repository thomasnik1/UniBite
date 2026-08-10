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

const editRating = async (ratingData) => {
    const { user_id, rating_id, rating_score } = ratingData;
    const rating = await Rating.findByPk(rating_id);

    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumer_id !== user_id) {
        throw new Error('Unauthorized to rate this request');
    };

    const editedRating = await rating.update(ratingData);

    return editedRating;
};

const deleteRating = async ( rating_id, user_id ) => {
    const rating = await Rating.findByPk(rating_id);

    console.log('user:', user_id, 'rating_id:', rating_id);
    if (!rating) {
        throw new Error('Rating not found');
    };

    if (rating.consumer_id !== user_id) {
        throw new Error('Unauthorized to delete this request');
    };    

    const deleteRating = await rating.destroy();
}

module.exports = {
    createRating,
    editRating,
    deleteRating
};