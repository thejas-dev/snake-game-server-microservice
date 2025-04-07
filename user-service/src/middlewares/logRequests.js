const requestLogger = require('../utils/requestLogger');

const logRequests = (req,res,next) => {
    requestLogger.info(`Received ${req.method} request to ${req.url}`);
    requestLogger.info(`Request Body ${JSON.stringify(req.body)}`);
    next();
}

module.exports = logRequests;