import * as amqp from 'amqplib'

export class RabbitMQConnection {
    public static connection: amqp.Connection | null = null
    public static channel: amqp.Channel | null = null

    public static async init(url: string, queueName: string) {
        RabbitMQConnection.connection = await amqp.connect(url)
        RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel()
        await RabbitMQConnection.channel.assertQueue(queueName, { durable: false })
    }

    public static async sendMessage(msg: any, queueName: string) {
        RabbitMQConnection.channel!.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)))
        console.log('SENT: ', JSON.stringify(msg))
    }

    public static async consumeMessage(queueName: string, callback: (msg: any) => void) {
        await RabbitMQConnection.channel!.consume(queueName, callback, {noAck: false})
    }
}
