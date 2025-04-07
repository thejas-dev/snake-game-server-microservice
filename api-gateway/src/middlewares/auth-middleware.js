const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const validateToken = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        logger.error("Access attempted without JWT token");
        return res.status(401).json({
            success: false,
            message: "Authentication required! Please login and retry"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET,(err, user)=>{
        if(err){
            logger.error("Invalid JWT token");
            console.log(err);
            return res.status(429).json({
                success: false,
                message: "Access denied! Invalid token"
            });
        }
        req.user = user;
        next();
    });
}

module.exports = validateToken;