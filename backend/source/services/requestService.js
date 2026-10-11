const { Ad, Request, User } = require('../models/models');
const { Op } = require('sequelize');
const AppError = require('../utilities/AppError');

const createRequest =  async (requestData) => {
    const newRequestData = {
        ...requestData
    };

    const ad = await Ad.findByPk(newRequestData.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (ad.status !== 'active') {
        throw new AppError('Ad is no longer active', 400);
    };

    const user = await User.findByPk(newRequestData.consumerId);
    if (!user) {
        throw new AppError('User not found', 404);
    };

    if (user.id === ad.cookId) {
        throw new AppError('You cannot request your own ad', 400);
    };

    if (user.credits < newRequestData.portions) {
        throw new AppError('Not enough credits', 400);
    };

    if (ad.portions < newRequestData.portions) {
        throw new AppError('Not enough portions available', 400);
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

const acceptRequest = async ({ requestId, cookId }) => {  
    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new AppError('Request not found', 404);
    };

    if (request.status !== 'pending') {
        throw new AppError('Request is not pending', 400);
    };

    const ad = await Ad.findByPk(request.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (ad.portions < request.portions) {
        throw new AppError('Not enough portions available', 400);
    };

    if (cookId !== ad.cookId) {
        throw new AppError('Unauthorized to accept this request', 403);
    };

    await request.update({ status: 'approved' });
    await ad.update({ portions: ad.portions - request.portions });

    if (ad.portions - request.portions === 0) {
        await ad.update ({ status: 'inactive' });
    };
    return request;
};

const rejectRequest = async ({ requestId, cookId }) => {
    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new AppError('Request not found', 404);
    };

    if (request.status !== 'pending') {
        throw new AppError('Request is not pending', 400);
    };

    const ad = await Ad.findByPk(request.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (ad.cookId !== cookId) {
        throw new AppError('Unauthorized to reject this request', 403)
    };

    const user = await User.findByPk(request.consumerId);
    if (!user) {
        throw new AppError('Consumer not found', 404);
    };

    await request.update({ status: 'rejected' });
    await user.update({ credits: user.credits + request.portions });
    return request;
};

const confirmPickup = async ({ cookId, requestId }) => {
    const cook = await User.findByPk(cookId);
    if (!cook) {
        throw new AppError('Cook not found', 404);
    };

    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new AppError('Request not found', 404);
    };

    if (request.status !== 'approved') {
        throw new AppError('Request is not approved', 400);
    };

    if (request.isPickedUp) {
        throw new AppError('Request has already been picked up', 400);
    };

    const ad = await Ad.findByPk(request.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if(cook.id !== ad.cookId) {
        throw new AppError('Unauthorized to confirm pickup', 403);
    };

    const pickupTime = new Date();
    await request.update({ isPickedUp: 1 , pickupTime: pickupTime });
    return;
};

const reportNoShow = async ({ cookId, requestId }) => {
    const cook = await User.findByPk(cookId);
    if (!cook) {
        throw new AppError('Cook not found', 404);
    };

    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new AppError('Request not found', 404);
    };

    if (request.status !== 'approved') {
        throw new AppError('Request is not approved', 400);
    };

    if (request.isPickedUp) {
        throw new AppError('Request has already been picked up', 400);
    };

    const ad = await Ad.findByPk(request.adId);
    if (!ad) {
        throw new AppError('Ad not found', 404);
    };

    if (cook.id !== ad.cookId) {
        throw new AppError('Unauthorized to report no show', 403);
    };

    const consumer = await User.findByPk(request.consumerId);
    if (!consumer) {
        throw new AppError('Consumer not found', 404);
    };

    await ad.update({ portions: ad.portions + request.portions });
    await request.update({ noShowReported: 1, penaltyApplied: 1 });
    await consumer.update({ credits: consumer.credits + request.portions -1 });
    return;
};

const showPendingRequests = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new AppError('User does not exist', 404);
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
};

const showPastRequests = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new AppError('User does not exist', 404);
    }

    const requests = await Request.findAll({
        include: [{
            model: Ad,
            as: 'ad', 
            where: {
                cook_id: user.id 
            }
        }]
    });

    return requests;
};

const getPendingRequestCount = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new AppError('User does not exist', 404);
    }

    const count = await Request.count({
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

    return count;
};

const showIncomingRequests = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new AppError('User does not exist', 404);
    }

    const requests = await Request.findAll({
        where: {
            '$ad.cook_id$': user.id
        },
        include: [{
            model: Ad,
            as: 'ad'
        },
        {
            model: User,
            as: 'requester',
            attributes: ['username']
        }]
    });

    return requests;
};

const showOutgoingRequests = async (userId) => {
    const user = await User.findByPk(userId);

    if(!user) {
        throw new AppError('User does not exist', 404);
    }

    const requests = await Request.findAll({
        where: {
            consumer_id: user.id,
        },
        include: [{
            model: Ad,
            as: 'ad'
        }]
    });

    return requests;
};

module.exports = {
    createRequest,
    acceptRequest,
    rejectRequest,
    confirmPickup,
    reportNoShow,
    showPendingRequests,
    showPastRequests,
    getPendingRequestCount,
    showIncomingRequests,
    showOutgoingRequests
};