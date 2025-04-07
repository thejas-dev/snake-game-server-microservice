const LicenseRepository = require('../repositories/LicenseRepository');
const logger = require('../utils/logger');
const licenseRepository = new LicenseRepository();
const errorResponse = require('../utils/errorResponse');
const { validateGetLicense, validateCreateLicense } = require('../utils/requestValidation');

module.exports.createLicense = async(req,res,next) => {
    logger.info("Create License endpoint hit...");

    try {
        const {error} = validateCreateLicense();
        if(error){
            logger.warn("Validation error in create license endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }
        const {userId} = req.body;
        const license = await licenseRepository.createNewLicense(userId);
        if(!license){
            logger.error("Error in creating license for user: " + userId);
            return res.status(500).json({success: false, message: "Error in creating license"});
        }

        logger.info("License created successfully for user: " + userId);
        return res.status(201).json({success: true, message: "License created successfully", permissions: license.permissions});
        
    } catch (error) {
        errorResponse(res,error,"Error in creating license details for the user " + req.userId);
    }
}

module.exports.getLicense = async(req,res,next) => {
    logger.info("Get license endpoint hit...");
    try {
        const {error} = validateGetLicense(req.body);
        if(error){
            logger.warn("Validation error in get license endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }
        const {userId} = req.body;
        
        const cacheKey = `license:${userId}`;
        const cachedLicense = await req.redisClient.get(cacheKey);
        
        if(cachedLicense){
            console.log(JSON.parse(cachedLicense));
            return res.status(200).json({
               success: true, 
               cache: true, 
               message: "License fetched successfully", 
               permissions: JSON.parse(cachedLicense).permissions,
            })
        }

        const license = await licenseRepository.getLicenseById(userId);
        if(!license){
            logger.error("Error in getting license for user: " + userId);
            return res.status(404).json({success: false, message: "License not found for the user"});
        }

        await req.redisClient.setex(cacheKey, 300, JSON.stringify(license));

        logger.info("License fetched successfully for user: " + userId);
        return res.status(200).json({success: true, message: "License fetched successfully", permissions: license.permissions});
        
    } catch (error) {
        errorResponse(res,error,"Error in getting license details for the user " + req.body.userId);
    }
}