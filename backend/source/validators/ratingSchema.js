const Joi = require('joi');

const createRatingSchema = Joi.object({
    requestId: Joi.number().integer().positive(),
    ratingScore: Joi.number().integer().positive().min(1).max(5)
}).options({
    presence: 'required',
    stripUnknown: true
});

const editRatingSchema = Joi.object({
    ratingScore: Joi.number().integer().positive().min(1).max(5)
}).options({
    presence: 'required',
    stripUnknown: true
});

const deleteRatingSchema = Joi.object({
    id: Joi.number().integer().positive()
}).options({
    presence: 'required',
    stripUnknown: true
});

module.exports = {
    createRatingSchema,
    editRatingSchema,
    deleteRatingSchema
};