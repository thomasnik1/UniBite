const Request = require('../models/Requests');

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

module.exports = {
    createRequest
};