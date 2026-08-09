const Ad = require('../models/Ad');
const Request = require('../models/Request');
const User =  require('../models/User');
const { Op } = require('sequelize');

const createRating = async (ratingData) => {
    const { consumer_id, request_id, rating } = ratingData;

    const request= await Request.findByPk(request_id);

    if (!requests) {
        throw new Error('Request not found');
    };

    if (request.consumer_id !== consumer_id) {
        throw new Error('Unauthorized to rate this request');
    };

    if (request.status !== 'approved') {
        throw new Error('Request is not approved');
    };

}

module.exports = {
    createRating
};