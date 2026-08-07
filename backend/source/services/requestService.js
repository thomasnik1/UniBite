const Ad = require('../models/Ad');
const Request = require('../models/Request');
const User = require('../models/User');
const { Op } = require('sequelize');

const createRequest =  async (requestData) => {

    const { userId, adId , portions } = requestData;

    const ad = await Ad.findByPk(adId);
    const user = await User.findByPk(userId);

    if (!ad) {
        throw new Error('Ad not found');
    };

    if (user.id === ad.cook_id) {
        throw new Error('You cannot request your own ad');
    };

    if (user.credits < portions) {
        throw new Error('Not enough credits');
    };

    if (ad.portions < portions) {
        throw new Error('Not enough portions available');
    };

    if (portions <= 0) {
        throw new Error('Portions must be greater than 0');
    };

    const newRequest = await Request.create({
        consumer_id: userId,
        ad_id: adId,
        portions: portions,
        status: 'pending'
    });

    return {
        newRequest: {
            id: newRequest.id,
            consumer_id: newRequest.consumer_id,
            portions: newRequest.portions,
            ad_id: newRequest.ad_id,
            status: newRequest.status   
        }
    };

    await user.update({ credits: user.credits - portions });

};

const acceptRequest = async (requestId) => {
    const request = await Request.findByPk(requestId);

    if (!request) {
        throw new Error('Request not found');
    };

    const ad = await Ad.findByPk(request.ad_id);

    if (!ad) {
        throw new Error('Ad not found');
    };

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    if (ad.portions < request.portions) {
        throw new Error('Not enough portions available');
    };

    await request.update({ status: 'approved' });
    await ad.update({ portions: ad.portions - request.portions });
    if (ad.portions - request.portions === 0) {
        await ad.update ({ status: 'inactive' });
    };
    return request;
};

const rejectRequest = async (requestId) => {
    const request = await Request.findByPk(requestId);
    const user = await User.findByPk(request.consumer_id);

    if (!request) {
        throw new Error('Request not found');
    };

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    await request.update({ status: 'rejected' });
    await user.update({ credits: user.credits + request.portions });
    return request;
};

module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest
};