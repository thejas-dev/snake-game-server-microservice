
const RefreshToken = require('../models/RefreshToken');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');
const {validateRegistration, validateLogin} = require('../utils/validation');
const UserRepository = require('../repositories/userRepository');
const { publishEvent } = require('../utils/rabbitmq');
const userRepository = new UserRepository();

// User registration
const registerUser = async(req,res,next) => {
    logger.info("User registration endpoint hit...");
    try {

        // Validate the schema
        const {error} = validateRegistration(req.body);
        if(error){
            logger.warn("Validation error in registration endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }

        const {password, username}  = req.body;
        let user = await userRepository.findOneUser(username);
        if(user){
            logger.warn(`User already exists for ${username}`);
            return res.status(400).json({success:false, message: "User already exists with given username"});
        }

        user = await userRepository.createUser(username, password);
        logger.warn("New user created userid " + user._id);

        const {accessToken, refreshToken} = await generateToken(user);

        await publishEvent('user.created',{
            userId: user._id,
        })

        res.status(201).json({
            success:true,
            message: "User registered successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: user._id,
        })
    } catch (error) {
        logger.error("Registration error occured",error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


// User login
const loginUser = async(req,res,next) => {
    logger.info("User login endpoint hit...");
    try {
        const {error} = validateLogin(req.body);
        if(error){
            logger.warn("Validation error in login  endpoint", error.details[0].message);
            return res.status(400).json({success:false, message: error.details[0].message});
        }
        const {username, password}  = req.body;
        const user = await userRepository.findOneUser(username);
        if(!user){
            logger.warn(`User not found for ${username}`);
            return res.status(401).json({success:false, message: "Invalid credentials"});
        }
        const isValidPassword = await user.comparePassword(password);
        if(!isValidPassword){
            logger.warn(`Invalid password send for username: ${username}`);
            return res.status(401).json({success:false, message: "Invalid credentials"});
        }

        const {accessToken, refreshToken} = await generateToken(user);
        res.status(200).json({
            success:true,
            message: "User logged in successfully",
            userId: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken
        })

    } catch (error) {
        logger.error("Login error occured",error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })   
    }
}

// Refresh token
const refreshTokenUser = async(req,res,next) => {
    logger.info("Refresh token endpoint hit...");
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            logger.warn("No refresh token provided");
            return res.status(401).json({success:false, message: "No refresh token provided"});
        }

        const storedToken =  await RefreshToken.findOne({token:refreshToken});

        if(!storedToken || storedToken.expiresAt < new Date()){
            logger.warn("Invalid or expired refresh token");
            return res.status(401).json({success:false, message: "Invalid or expired refresh token"});
        }

        const user = await userRepository.findUserById(storedToken.user);

        if(!user){
            logger.warn("User not found for refresh token");
            return res.status(401).json({success:false, message: "User not found for the refresh token"});
        }

        const {accessToken: newAccessToken,refreshToken: newRefreshToken} = await generateToken(user);

        // delete the old refresh token
        await RefreshToken.deleteOne({_id: storedToken._id});

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        logger.error("Refresh token error occured",error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


// logout
const logoutUser = async(req,res,next) => {
    logger.info("Logout endpoint hit...");
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            logger.warn("No refresh token provided");
            return res.status(401).json({success:false, message: "No refresh token provided"});
        }

        await RefreshToken.deleteOne({token: refreshToken});
        logger.info("Refresh token deleted for logout");

        res.json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        logger.error("Logout error occured",error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    registerUser,
    loginUser,
    refreshTokenUser,
    logoutUser
}