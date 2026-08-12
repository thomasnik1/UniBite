const Joi = require('joi');

const baseAdSchema = {
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow(''),
    allergens: Joi.string().max(200).allow(''),
    portions: Joi.number().integer().min(1),
    pickup_location: Joi.string().max(200),
    pickup_time: Joi.date().greater('now'),
    status: Joi.string().valid('active', 'inactive', 'deleted')
};

const createAdSchema = Joi.object(baseAdSchema).options({
    presence : 'required'
});

const editAdSchema = Joi.object(baseAdSchema).min(1).options({
    stripUnknown: true
});

module.exports = {
    createAdSchema,
    editAdSchema
};