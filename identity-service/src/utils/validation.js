const Joi = require('joi');

const validateRegistration = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

module.exports = {validateRegistration, validateLogin};