import { RabbitMQConnection } from "./utils/RabbitMQConnection"
import { error } from "console"
import { MessageHandler } from "./utils/MessageHandler"
import { PrismaConnection } from "./utils/PrismaConnection";
require('dotenv').config({ path: '.env' });

const URL = process.env.RABBITMQ_URL
export const QUEUE_3 = "queue3";
export const QUEUE_4 = "queue4";

// Initialize RabbitMQ connection
const main = async () => {

    await RabbitMQConnection.init(URL!, QUEUE_4)
    await RabbitMQConnection.consumeMessage(QUEUE_3, (msg) => {
        MessageHandler.handleMessage(msg, QUEUE_4)
    }).catch((err) => {
        console.error("Failed to consume the message:", err)
        process.exit(1)
    })
    console.log('Started consuming from queue3')

}

main().catch((err) => {
    error("Failed to initialize the app:", err)
    process.exit(1)
})
