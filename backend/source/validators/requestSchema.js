const Joi = require('joi')

const createRequestSchema = Joi.object({
    adId: Joi.number().integer().positive(),
    portions: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

const acceptRequestSchema =Joi.object({
    id: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

const rejectRequestSchema =Joi.object({
    id: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

const confirmPickupIdSchema = Joi.object({
    id: Joi.number().integer().positive(),
}).options({
    presence: 'required',
    stripUnknown: true
});

const confirmPickupAdIdSchema = Joi.object({
    adId: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

const reportNoShowSchema = Joi.object({
    id: Joi.number().integer().positive(),
    adId: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

module.exports = {
    createRequestSchema,
    acceptRequestSchema,
    rejectRequestSchema,
    confirmPickupIdSchema,  
    confirmPickupAdIdSchema,
    reportNoShowSchema
};