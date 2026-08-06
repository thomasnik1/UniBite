const Request = require('../models/Requests');
const { Op } = require('sequelize');

const createRequest =  async (requestData) => {

    const { userId, adId , portions } = requestData;

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

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    await request.update({ status: 'approved' });
    return request;
};

module.exports = {
    createRequest,
    acceptRequest
};