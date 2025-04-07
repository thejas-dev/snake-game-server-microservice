const logger = require("./logger")

module.exports.logRequests = async(event, message) => {
    logger.info(`Event : ${event}, Message : ${message}`);
}