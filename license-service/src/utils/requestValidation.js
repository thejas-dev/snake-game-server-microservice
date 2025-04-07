const Joi = require('joi');

const validateGetLicense = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required()
    });

    return schema.validate(data);
}

const validateCreateLicense = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required()
    });

    return schema.validate(data);
}


module.exports = {validateGetLicense,validateCreateLicense};