const Joi = require('joi');

const validateCreateRoomDetails = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        users: Joi.array().required()
    });

    return schema.validate(data);
}

const validateCheckRoomDetails = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
    });

    return schema.validate(data);
}

const validateJoinRoomDetails = (data) => {
    const schema = Joi.object({
        users: Joi.array().min(1).required(),
    });

    return schema.validate(data);
}

const validateEditPositionDetails = (data) => {
    const schema = Joi.object({
        users: Joi.array().min(1).required(),
        roomId: Joi.string().required(),
    });

    return schema.validate(data);
}


module.exports = {validateCreateRoomDetails, validateCheckRoomDetails, 
    validateJoinRoomDetails, validateEditPositionDetails};