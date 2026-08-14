const { Op } = require('sequelize');
const { Rating, Request, User } = require('../models/models');

const nonRatingPenalty = async() => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setHourst(twoDaysAgo.getHours() - 48);

        const nonRatedRequests = await Request.findAll({
            where: {
                pickup_time: {
                    [Op.lt]: twoDaysAgo
                },
                penalty_applied: false
            },
            include: [
                {
                    model: Rating,
                    as: 'rating',
                    required: false
                },
                {
                    model: User,
                    as: 'consumer'
                }
            ]
        });

        const requestsToPenalize = nonRatedRequests.filter( req => req.rating === null )
        
        for (const req of requestsToPenalize) {
                if (req.consumer) {
                await req.consumer.decrement('credits', { by: 1 });
            }
            await req.update({ penalty_applied: true });
        };

    } catch (error) {
        console.error('Error during rating penalty job');
    }
};

module.exports = {
    nonRatingPenalty
};