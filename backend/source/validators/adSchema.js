const Joi = require('joi');

const adSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow(''),
    allergens: Joi.string().max(200).allow(''),
    portions: Joi.number().integer().min(1),
    pickup_location: Joi.string().max(200),
    pickup_time: Joi.date().greater('now'),
    status: Joi.string().valid('active', 'inactive', 'deleted')
});

const createAdSchema = adSchema.Joi.object(adSchema)