const Request = require('../models/Request');

const createRequest =  async (requestData) => {

    const newRequest = await Request.create({
        user_id: requestData.userId,
        ad_id: requestData.adId,
        status: 'pending'
    });
    return newRequest;
};

module.exports = {
    createRequest
};