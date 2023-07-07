import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { RabbitMQConnection } from "./utils/RabbitMQConnection"
import { error, log } from "console"
import { HouseRoutes } from "./routes/HouseRoutes"
import { MessageHandler } from "./utils/MessageHandler"
import { OwnerRoutes } from "./routes/OwnerRoutes"

const app = express()
const URL = process.env.RABBITMQ_URL
export const QUEUE_1 = "queue1"
export const QUEUE_2 = "queue2"
export const QUEUE_3 = "queue3"
export const QUEUE_4 = "queue4"
const port = 3000
require("dotenv").config({ path: ".env" })

app.use(bodyParser.json())
app.use(cors())

const main = async () => {
  const userRoutes = new HouseRoutes()
  const ownerRoutes = new OwnerRoutes()
  app.use(userRoutes.getRouter())
  app.use(ownerRoutes.getRouter())

  await RabbitMQConnection.init(URL!, QUEUE_3)
  await RabbitMQConnection.consumeMessage(QUEUE_2, MessageHandler.receiveResponse).catch(
    (err) => {
      error("Failed to consume the message:", err)
      process.exit(1)
    }
  )

  await RabbitMQConnection.consumeMessage(QUEUE_4, MessageHandler.receiveResponse).catch(
    (err) => {
      error("Failed to consume the message:", err)
      process.exit(1)
    }
  )
}

app.listen(port, async () => {
  console.log("Server listening on port 3000")
})

main().catch((err) => {
  error("Failed to initialize the app:", err)
  process.exit(1)
})