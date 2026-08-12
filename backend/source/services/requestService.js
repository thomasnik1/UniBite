const { Ad, Request, User } = require('../models/models');
const { Op } = require('sequelize');

const createRequest =  async (requestData) => {

    const newRequestData = {
        ...requestData
    };

    const ad = await Ad.findByPk(newRequestData.adId);
    const user = await User.findByPk(newRequestData.consumerId);

    if (!ad) {
        throw new Error('Ad not found');
    };

    if (user.id === ad.cookId) {
        throw new Error('You cannot request your own ad');
    };

    if (user.credits < newRequestData.portions) {
        throw new Error('Not enough credits');
    };

    if (ad.portions < newRequestData.portions) {
        throw new Error('Not enough portions available');
    };

    if (newRequestData.portions <= 0) {
        throw new Error('Portions must be greater than 0');
    };

    const newRequest = await Request.create({
        consumerId: newRequestData.consumerId,
        adId: newRequestData.adId,
        portions: newRequestData.portions,
        status: 'pending'
    });

    await user.update({ credits: user.credits - newRequestData.portions });

    return {
        newRequest: {
            id: newRequest.id,
            consumerId: newRequest.consumerId,
            portions: newRequest.portions,
            adId: newRequest.adId,
            status: newRequest.status   
        }
    };
};

const acceptRequest = async (acceptRequestData) => {
   
    const newAcceptRequestData = {
        ...acceptRequestData
    };

    const request = await Request.findByPk(newAcceptRequestData.requestId);
    const ad = await Ad.findByPk(request.adId);


    if (!request) {
        throw new Error('Request not found');
    };

    if (!ad) {
        throw new Error('Ad not found');
    };

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    if (ad.portions < request.portions) {
        throw new Error('Not enough portions available');
    };

    if (newAcceptRequestData.cookId !== ad.cookId) {
        throw new Error('Unauthorized to accept this request');
    };

    await request.update({ status: 'approved' });
    await ad.update({ portions: ad.portions - request.portions });

    if (ad.portions - request.portions === 0) {
        await ad.update ({ status: 'inactive' });
    };
    return request;
};

const rejectRequest = async (rejectRequestData) => {
    
    const newRejectRequestData = {
        ...rejectRequestData
    };

    const request = await Request.findByPk(newRejectRequestData.requestId);
    const ad = await Ad.findByPk(request.adId);
    const user = await User.findByPk(request.consumerId);

    if (!request) {
        throw new Error('Request not found');
    };

    if (request.status !== 'pending') {
        throw new Error('Request is not pending');
    };

    if (ad.cookId !== newRejectRequestData.cookId) {
        throw new Error('Unauthorized to reject this request.')
    };

    await request.update({ status: 'rejected' });
    await user.update({ credits: user.credits + request.portions });
    return request;
};

const confirmPickup = async (confirmPickupData) => {
    const newConfirmPickupData = {
        ...confirmPickupData
    };

    const ad = await Ad.findByPk(newConfirmPickupData.adId);
    const cook = await User.findByPk(newConfirmPickupData.cookId);
    const request = await Request.findByPk(newConfirmPickupData.requestId);

    console.log(requestData);

    if(cook.id !== ad.cookId) {
        throw new Error('Unauthorized to confirm pickup');
    };

    if (request.status !== 'approved') {
        throw new Error('Request is not approved');
    };

    await request.update({ isPickedUp: 1 });
    return;
};

const showPendingRequests = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new Error('User does not exist');
    }

    const requests = await Request.findAll({
        where: {
            status: 'pending'
        },
        include: [{
            model: Ad,
            as: 'ad', 
            where: {
                cook_id: user.id 
            }
        }]
    });

    return requests;
}

module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest,
    confirmPickup,
    showPendingRequests
};