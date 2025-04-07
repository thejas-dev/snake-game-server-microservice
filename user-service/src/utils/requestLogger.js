const winston = require('winston');

const requestLogger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.splat(),
        winston.format.json(),
    ),
    defaultMeta: {service: 'identity-service-requests'},
    transports:[
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: 'requestErrors.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'requests.log',
        })
    ]
})

module.exports = requestLogger;