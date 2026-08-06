const Request = require('../models/Requests');
const Ad = require('../models/Ad');
const { Op } = require('sequelize');

const createRequest =  async (requestData) => {

    const { userId, adId , portions } = requestData;

    const ad = await Ad.findByPk(adId);

    if (!ad) {
        throw new Error('Ad not found');
        console.log('Ad not found');
    }

    if (ad.portions < portions) {
        throw new Error('Not enough portions available');
        console.log('Not enough portions available');
    }

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

    if (ad.portions < request.portions) {
        throw new Error('Not enough portions available');
    }

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    await request.update({ status: 'approved' });
    await ad.update({ portions: ad.portions - request.portions });
    return request;
};

const rejectRequest = async (requestId) => {
    const request = await Request.findByPk(requestId);

    if (!request) {
        throw new Error('Request not found');
    };

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    await request.update({ status: 'rejected' });
    return request;
};

module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest
};