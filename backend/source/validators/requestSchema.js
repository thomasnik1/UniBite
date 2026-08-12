const Joi = require('joi')

const baseRequestSchema = Joi.object({
    ad_id: Joi.number().int().min(1),
    user_id: Joi.number().int().min(1),
    status: Joi.string().valid('pending','approved','rejected'),
    portions: Joi.number().int().min(1),
    is_picked_up: Joi.number().int().valid('0','1')
});

const createRequestSchema = baseRequestSchema.options({
    required: 'true'
});

const confirmPickup = Joi.object(
    baseRequestSchema.user_id,
    baseRequestSchema.ad_id,
    )

