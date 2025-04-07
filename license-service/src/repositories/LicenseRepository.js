const License = require("../models/License");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

class LicenseRepository{
    initialize() {
        mongoose.connect(process.env.MONGODB_URI).then(() =>{
            console.log('MongoDB Connected...')
            logger.info('MongoDB Connected successfully');
        }).catch((err)=>{
            logger.error("Mongo connection error: " + err);
        });
    }

    async createNewLicense(userId){
        return await License.create({
            userId: userId,
            permissions:['create', 'join']
        });
    }

    async getLicenseById(userId){
        return await License.findOne({userId:userId});
    }
}

module.exports = LicenseRepository;