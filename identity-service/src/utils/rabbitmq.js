const amqp = require('amqplib');
const logger = require('./logger');

let connection = null;
let channel = null;

const EXCHANGE_NAME = "post_events";

async function connectToRabbitMQ() {
    try{
        console.log(process.env.RABBITMQ_URL);
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', {durable:false});
        logger.info("Connected to RabbitMQ successfully");

        return channel;
    }catch(e){
        logger.error("Error connecting to RabbitMQ", e);
    }
}

async function publishEvent(routingKey, message) {

    if(!channel){
        await connectToRabbitMQ();
    }

    channel.publish(EXCHANGE_NAME, routingKey,
        Buffer.from(JSON.stringify(message)));

    logger.info(`Event Published routingKey: ${routingKey}: ${JSON.stringify(message)}`);
}

async function consumeEvent(routingKey, callback) {
    try {
        if(!channel) {
            await connectToRabbitMQ();
        }

        const q = await channel.assertQueue("",{exclusive: true});

        await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

        channel.consume(q.queue,(msg)=>{
            if(msg !== null){
                const content = JSON.parse(msg.content.toString());
                callback(content); 
                channel.ack(msg);
            }
        })

        logger.info(`Consumer started for routingKey: ${routingKey}`);
    } catch (error) {
        logger.error("Error consuming RabbitMQ event", error);
    }
}

module.exports = {connectToRabbitMQ, publishEvent, consumeEvent};