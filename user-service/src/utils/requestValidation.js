const Joi = require('joi');

const validateGetUserDetails = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required()
    });

    return schema.validate(data);
}

const validateAddRoomToUser = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        roomId: Joi.string().required()
    });

    return schema.validate(data);
}


module.exports = {validateGetUserDetails,validateAddRoomToUser};