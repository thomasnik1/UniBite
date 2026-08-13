const Joi = require('joi')

const baseRequestSchema = Joi.object({
    adId: Joi.number().integer().min(1),
    portions: Joi.number().integer().min(1),
});

const createRequestSchema = baseRequestSchema.options({
    presence: 'required'
});

// const confirmPickup = Joi.object(
//     baseRequestSchema.coid,
//     baseRequestSchema.ad_id,
//     )

module.exports = {
    createRequestSchema
};