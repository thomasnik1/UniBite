const Joi = require('joi');

const createUserSchema = Joi.object({
    username: Joi.string().min(1).max(25),
    email: Joi.string().email().min(1),
    password: Joi.string().min(6)
}).options({
    presence: 'required'
});

const loginUserSchema = Joi.object({
    username: Joi.string().min(1).max(25),
    password: Joi.string().min(6)
}).options({
    presence: 'required'
});

module.exports = {
    createUserSchema,
    loginUserSchema
};