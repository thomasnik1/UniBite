const { Op } = require('sequelize');
const { Rating, Request, User } = require('../models/models');

const nonRatingPenalty = async() => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

        const nonRatedRequests = await Request.findAll({
                pickup_time: {
                    [Op.lt]: twoDaysAgo
                },
                penalty_applied: false,
                is_rated: false
    })

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