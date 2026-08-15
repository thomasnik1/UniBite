const Joi = require('joi');

const createAdSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow('').optional(),
    allergens: Joi.string().max(200).allow('').optional(),
    portions: Joi.number().integer().positive(),
    pickupLocation: Joi.string().max(200),
    pickupTime: Joi.date().greater('now')
}).options({
    presence: 'required',
    stripUnknown: true
});

const editAdSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow(''),
    allergens: Joi.string().max(200).allow(''),
    portions: Joi.number().integer().positive(),
    pickupLocation: Joi.string().max(200),
    pickupTime: Joi.date().greater('now')
}).min(1)
.options({
    stripUnknown: true
});

const deleteAdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
}).options({
    presence: 'required',
    stripUnknown: true
});

module.exports = {
    createAdSchema,
    editAdSchema,
    deleteAdSchema
};