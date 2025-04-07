const UserRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');
const errorResponse = require('../utils/errorResponse');
const { validateGetUserDetails, validateAddRoomToUser } = require('../utils/requestValidation');
const userRepository = new UserRepository();


module.exports.getUserDetails = async(req, res, next) => {
    logger.info('getUserDetails endpoint hit....');
    try {
        const {error} = validateGetUserDetails(req.body);

        if(error){
            logger.warn("Validation error in get user details endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }
        
        const {userId} = req.body;

        const cacheKey = `user:${userId}`;
        const cachedUser = await req.redisClient.get(cacheKey);

        if(cachedUser){
            return res.status(200).json({success: true, cache: true, message: "User fetched successfully", user: JSON.parse(cachedUser)});
        }

        const user = await userRepository.findById(userId);
        if(!user){
            logger.warn(`No user found for id: ${userId}`);
            return res.status(404).json({success:false, message: "No users found with given ids"});
        }

        await req.redisClient.setex(cacheKey, 300, JSON.stringify(user));

        return res.status(200).json({success: true, message: "User fetched successfully", user: user});
        
    } catch (error) {
        errorResponse(res,error,"Error in getting user details");
    }
}

module.exports.addRoomToUser = async(req, res, next) => {
    logger.info('addRoomToUser endpoint hit....');
    try {
        const {error} = validateAddRoomToUser(req.body);

        if(error){
            logger.warn("Validation error in get user details endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }

        const {userId, roomId} = req.body;
        const user = await userRepository.addRoomToUser(userId, roomId);

        if(!user){
            logger.warn(`Cannot update current room to user: ${userId}`);
            return res.status(404).json({success:false, message: "Cannot update current room to user"});
        }

        await req.redisClient.del(`user:${userId}`);

        return res.status(200).json({success: true, message: "Room added successfully to user", user: user});        
    } catch (error) {
        errorResponse(res,error,"Error in getting user details");
    }
}