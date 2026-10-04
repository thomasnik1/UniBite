// Σιγουρέψου ότι το path είναι σωστό (π.χ. '../models' αν τα κάνεις export από το index.js)
const { User, Ad, Request, Rating } = require('../models/models'); 
const { Op } = require('sequelize');
const sequelize = require('../configuration/database');

const calculatePortionsLastMonth = async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const total = await Request.sum('portions', {
        where: {
            isPickedUp: true,
            // ΔΙΟΡΘΩΣΗ: Χρήση createdAt επειδή το Request.js έχει updatedAt: false
            created_at: { 
                [Op.gte]: oneMonthAgo
            }
        }
    });

    return total || 0;
};

const findTopDonor = async () => {
    const topDonor = await Request.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('Request.portions')), 'totalDonated']
        ],
        where: {
            isPickedUp: true
        },
        include: [{
            model: Ad,
            as: 'ad', 
            attributes: [],
            include: [{
                model: User,
                as: 'cook', 
                attributes: ['id', 'username']
            }]
        }],
        // ΔΙΟΡΘΩΣΗ: Σωστή σύνταξη ομαδοποίησης (grouping) για nested includes στο Sequelize
        group: ['ad->cook.id', 'ad->cook.username'],
        order: [[sequelize.literal('totalDonated'), 'DESC']],
        limit: 1, 
        raw: true 
    });

    return topDonor.length > 0 ? topDonor[0] : null;
};

const findTopMeals = async () => {
    const topMeals = await Rating.findAll({
        // ΔΙΟΡΘΩΣΗ: Βάσει του Rating.js το property ονομάζεται ratingScore, όχι score
        order: [['ratingScore', 'DESC']],
        limit: 5,
        include: [{
            model: Request,
            as: 'request',
            attributes: ['id'],
            include: [{
                model: Ad,
                as: 'ad',
                attributes: ['title', 'imageUrl', 'portions']
            }]
        }]
    });

    return topMeals;
};

module.exports = {
    calculatePortionsLastMonth,
    findTopDonor,
    findTopMeals
};