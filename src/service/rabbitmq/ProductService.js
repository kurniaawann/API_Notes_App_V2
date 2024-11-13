const amqp = require('amqplib');
const ProductService = {
    sendMessage:async (queue, message)=> {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const chanel = await connection.createChannel();
        await chanel.assertQueue(queue, {
            durable:true
        });

        await chanel.sendToQueue(queue, Buffer.from(message));

        setTimeout(() => {
            connection.close();
          }, 1000);
    }
};

module.exports = ProductService