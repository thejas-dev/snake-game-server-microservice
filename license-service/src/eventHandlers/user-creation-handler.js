const LicenseRepository = require('../repositories/LicenseRepository');
const licenseRepository = new LicenseRepository();
const logger = require('../utils/logger');

module.exports.handleNewUserCreated = async(event) => {
    console.log("userCreatedEvent",event);
    const {userId} = event;

    try {
        const license = await licenseRepository.createNewLicense(userId);
        if(!license){
            logger.error("Error in creating license for user: " + userId);
            throw new Error("Error in creating license");
        }
        logger.info("License created successfully for user: " + userId);
    } catch (error) {
        logger.error("Error in handling userCreated event for user: " + userId, error);
        throw error;
    }

}

