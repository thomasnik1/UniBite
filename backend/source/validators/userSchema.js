const Joi = require('joi');

const createUserSchema = Joi.object({
    username: Joi.string().min(1).max(25),
    email: Joi.string().email().min(1),
    password: Joi.string().min(6)
}).options({
    presence: 'required',
    stripUnknown: true
});

const loginUserSchema = Joi.object({
    username: Joi.string().min(1).max(25),
    password: Joi.string().min(6)
}).options({
    presence: 'required',
    stripUnknown: true
});

module.exports = {
    createUserSchema,
    loginUserSchema
};