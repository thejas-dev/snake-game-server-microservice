const Room = require('../models/Room');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

class RoomRepository {
    
    initialize() {
        mongoose.connect(process.env.MONGODB_URI).then(() =>{
            console.log('MongoDB Connected...')
            logger.info('MongoDB Connected successfully');
        }).catch((err)=>{
            logger.error("Mongo connection error: " + err);
        });
    }

    async findByIdAndUpdateUsers(roomId, users) {
        return await Room.findByIdAndUpdate(roomId,users,{new: true});
    }

    async createRoom(name, users){
        return await Room.create({
			name,users
		});
    }

    async checkRoom(name){
        return await Room.findOne({name});
    }

    async updateUsersInRoom(roomId, users){
        return await Room.findByIdAndUpdate(roomId,
            {
                users
            },{
                new: true
            }
        );
    }
}

module.exports = RoomRepository;