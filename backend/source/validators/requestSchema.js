// const Joi = require('joi')

// const baseRequestSchema = Joi.object({
//     adId: Joi.number().int().min(1),
//     consumerId: Joi.number().int().min(1),
//     status: Joi.string().valid('pending','approved','rejected'),
//     portions: Joi.number().int().min(1),
//     isPickedUp: Joi.number().int().valid('0','1')
// });

// const createRequestSchema = baseRequestSchema.options({
//     required: 'true'
// });

// const confirmPickup = Joi.object(
//     baseRequestSchema.coid,
//     baseRequestSchema.ad_id,
//     )

