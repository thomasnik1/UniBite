const Joi = require('joi');

const baseUserSchema = Joi.object({
    username: Joi.string().min(1).max(25),
    password: Joi.string()
});

const createUserSchema = baseUserSchema.append({
    email: Joi.string().email()
}).options({ presence: 'required' });

const loginUserSchema = Joi.object(baseUserSchema.username, baseUserSchema.password).options({
    presence: 'required'
});

module.exports = {
    createUserSchema,
    loginUserSchema
};