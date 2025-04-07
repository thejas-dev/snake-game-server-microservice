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

    async findById(userId) {
        return await User.findById(userId);
    }

    async findUsersById(userId) {
        return await User.find({_id:userId});
    }

    async addRoomToUser(userId,roomId) {
        return await User.findByIdAndUpdate(userId,{currentRoom:roomId},{new: true});
    }
}

module.exports = UserRepository;
