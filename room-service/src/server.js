require('dotenv').config();

const express = require('express');
const logger = require('./utils/logger');
const logRequests = require('./middlewares/logRequests');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const Redis = require('ioredis');
const helmet = require('helmet');
const {RateLimiterRedis} = require('rate-limiter-flexible');
const routes = require('./routes/room-service');
const RoomRepository = require('./repositories/roomRepository.js');


const app = express();
const PORT = process.env.PORT || 4004;

const roomRepository = new RoomRepository();
roomRepository.initialize();

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use(logRequests);

// DDOS protection and rate limiting
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rate_limiter',
    points: 100, // limit each IP to 100 requests per hour,
    duration: 10
})

app.use((req,res,next) => {
    rateLimiter.consume(req.ip)
    .then(() => {
        next();
    }).catch(err=>{
        logger.warn("Rate limit exceeded for IP: " + req.ip);
        res.status(429).json({success:false, message: 'Too Many Requests. Please try again later.'});
    })
})


app.use('/api/room', (req,res,next) => {
    req.redisClient = redisClient;
    next();
},routes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Room Service running on port ${PORT}`);
})

process.on('unhandledRejection',(reason, promise) => {
    logger.error('Unhandled Rejection at', promise, "reason: " + reason);
});
