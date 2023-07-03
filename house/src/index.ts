import { RabbitMQConnection } from "./utils/RabbitMQConnection"
import { error } from "console"
import { MessageHandler } from "./utils/MessageHandler"
require('dotenv').config({ path: '.env' });

const URL = process.env.RABBITMQ_URL
export const QUEUE_2 = "queue2";
export const QUEUE_1 = "queue1";

const main = async () => {

    await RabbitMQConnection.init(URL!, QUEUE_2)
    await RabbitMQConnection.consumeMessage(QUEUE_1, (msg) => {
        MessageHandler.handleMessage(msg, QUEUE_2)
    }).catch((err) => {
        console.error("Failed to consume the message:", err)
        process.exit(1)
    })
    console.log('Started consuming from queue1')

}

main().catch((err) => {
    error("Failed to initialize the app:", err)
    process.exit(1)
})
