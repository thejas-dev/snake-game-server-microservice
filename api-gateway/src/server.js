require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const logger = require('./utils/logger');
const proxy = require('express-http-proxy');
const errorHandler = require('./middlewares/errorHandler');
const validateToken = require('./middlewares/auth-middleware');

const app = express();
const PORT = process.env.PORT || 4000;

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());


// Rate limiting
const rateLimitOptions = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler:(req,res)=>{
        logger.warn("Sensitive endpoint rate limit exceeded for IP: " + req.ip + " for sensitive endpoint: " + req.url);
        res.status(429).json({success:false, message: 'Too Many Requests. Please try again later.'});
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})

app.use(rateLimitOptions);

app.use((req,res,next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request Body ${req.body}`);
    next();
})

const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/,'/api');
    },
    proxyErrorHandler: (err,res,next) => {
        logger.error(`Proxy Error: ${err.message}`);
        res.status(500).json({success: false, message: "Proxy Error", error: err.messge});
    }
}

app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOptions, srcReq) => {
        proxyReqOptions.headers['Authorization'] = `application/json`;
        return proxyReqOptions;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))

app.use('/v1/user', validateToken, proxy(process.env.USER_SERVICE_URL,{
    ...proxyOptions,
    proxyReqDecorator:(proxyReqOptions, srcReq) => {
        console.log("I ran");
        proxyReqOptions.headers['Content-Type'] = `application/json`;
        return proxyReqOptions;
    },
    userResDecorator:(proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response received from user service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))

app.use('/v1/license', validateToken, proxy(process.env.LICENSE_SERVICE_URL,{
    ...proxyOptions,
    proxyReqDecorator:(proxyReqOptions, srcReq) => {
        proxyReqOptions.headers['Content-Type'] = `application/json`;
        return proxyReqOptions;
    },
    userResDecorator:(proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response received from license service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))

app.use('/v1/room', validateToken, proxy(process.env.ROOM_SERVICE_URL,{
    ...proxyOptions,
    proxyReqDecorator:(proxyReqOptions, srcReq) => {
        proxyReqOptions.headers['Content-Type'] = `application/json`;
        return proxyReqOptions;
    },
    userResDecorator:(proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response received from room service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info("Identity Service running on port " + process.env.IDENTITY_SERVICE_URL);
    logger.info("User Service running on port " + process.env.USER_SERVICE_URL);
});