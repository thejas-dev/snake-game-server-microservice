const logger = require('./logger');

const errorResponse = (res,error,errorText) => {
    logger.error(errorText,error);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}

module.exports = errorResponse;