const User = require('../models/User');
const mongoose = require('mongoose');
const logger = require('../utils/logger');


class UserRepository {

    initialize() {
        mongoose.connect(process.env.MONGODB_URI).then(() =>{
            console.log('MongoDB Connected...')
            logger.info('MongoDB Connected successfully');
        }).catch((err)=>{
            logger.error("Mongo connection error: " + err);
        });
    }

    async createUser(username, password){
        let user = new User({username, password});
        return await user.save();
    }

    async findOneUser(username){
        return await User.findOne({ username:username });
    }

    async findUserById(userId){
        return await User.findById(userId);
    }

}

module.exports = UserRepository;