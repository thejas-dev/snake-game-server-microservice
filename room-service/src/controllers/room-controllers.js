const RoomRepository = require('../repositories/roomRepository');
const logger = require('../utils/logger');
const errorResponse = require('../utils/errorResponse');
const { validateCreateRoomDetails, validateCheckRoomDetails, validateJoinRoomDetails, validateEditPositionDetails } = require('../utils/requestValidation');
const roomRepository = new RoomRepository();

module.exports.createRoom = async(req,res,next)=>{
	try{
        const {error} = validateCreateRoomDetails(req.body);

        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

		const {name,users} = req.body;
		const room = await roomRepository.createRoom(name, users);
        if(!room){
            return res.status(400).json({
                success: false,
                message: "Failed to create room"
            });
        }

        logger.info("New room created with name " + name + " and room id " + room._id);
        return res.status(201).json({
            success: true,
            message: "Room created successfully",
            roomId: room._id,
            room
        });
	}catch(ex){
        errorResponse(res,"Error in creating room", ex);
	}
}

module.exports.joinRoom = async(req,res,next) => {
    try{
        const { error } = validateJoinRoomDetails(req.body);
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const roomId = req.params.id;
		const {users} = req.body;

        const room = await roomRepository.updateUsersInRoom(roomId, users);

        if(!room){
            logger.error("Failed to join room with id " + roomId);
            return res.status(404).json({
                success: false,
                message: "Failed to join room with id " + roomId,
            });
        }

        logger.info("User joined room with id " + roomId);
        return res.status(200).json({
            success: true,
            message: "User joined room successfully",
            roomId,
            room
        });

    }catch(ex){
        errorResponse(res,"Error in joining room", ex);
    }
}

module.exports.editPosition = async(req,res,next) => {
    try{
        const { error } = validateEditPositionDetails(req.body);
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { users, roomId } = req.body;

        const room = await roomRepository.updateUsersInRoom(roomId, users);

        if(!room){
            logger.error("Failed to edit room position with id " + roomId);
            return res.status(404).json({
                success: false,
                message: "Failed to edit room position with id " + roomId,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room position edited successfully",
            roomId,
            room
        });

    }catch(ex){
        errorResponse(res,"Error in editing room position", ex);
    }
}

module.exports.checkRoom = async(req, res, next) => {
    try {
        const { error } = validateCheckRoomDetails(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { name } = req.body;
        const room = await roomRepository.checkRoom(name);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });

        }
        logger.info("Room found with name " + name);
        return res.status(200).json({
            success: true,
            message: "Room found successfully",
            roomId: room._id,
            room
        });
    } catch (error) {
        errorResponse(res,"Error in checking room", ex);
    }
}
