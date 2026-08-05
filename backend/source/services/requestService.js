const Request = require('../models/Requests');
const { Op } = require('sequelize');

const createRequest =  async (requestData) => {

    const { userId, adId } = requestData;

    const newRequest = await Request.create({
        consumer_id: userId,
        ad_id: adId,
        status: 'pending'
    });

    return {
        newRequest: {
            id: newRequest.id,
            consumer_id: newRequest.consumer_id,
            ad_id: newRequest.ad_id,
            status: newRequest.status   
        }
    };

};

const acceptRequest = async (requestData) => {
    const { requestId, portions } = requestData;
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