import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { RabbitMQConnection } from "./utils/RabbitMQConnection";
import { error } from "console";
import { HouseRoutes } from "./routes/HouseRoutes";
import { MessageHandler } from "./utils/MessageHandler";
import { OwnerRoutes } from "./routes/OwnerRoutes";
import swaggerDocs from "./utils/swagger";

const app = express();
const URL = process.env.RABBITMQ_URL;
export const QUEUE_1 = "queue1";
export const QUEUE_2 = "queue2";
export const QUEUE_3 = "queue3";
export const QUEUE_4 = "queue4";
const port = 3000;
require("dotenv").config({ path: ".env" });

app.use(bodyParser.json());
app.use(cors());


//Mapping ceratain frontend files to their paths in the browser
const publicPath = path.join(__dirname, "../src/public");
app.use(express.static(publicPath));

app.get("/owner/login", (req, res) => {
  res.sendFile(path.join(publicPath, "pages/login.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(publicPath, "pages/dashboard.html"));
})

// Initializing the backend
const main = async () => {
  const userRoutes = new HouseRoutes();
  const ownerRoutes = new OwnerRoutes();
  app.use(userRoutes.getRouter());
  app.use(ownerRoutes.getRouter());

  await RabbitMQConnection.init(URL!, QUEUE_1);
  await RabbitMQConnection.init(URL!, QUEUE_3);
  await RabbitMQConnection.consumeMessage(QUEUE_2, MessageHandler.receiveResponse).catch(
    (err) => {
      error("Failed to consume the message:", err);
      process.exit(1);
    }
  );

  await RabbitMQConnection.consumeMessage(QUEUE_4, MessageHandler.receiveResponse).catch(
    (err) => {
      error("Failed to consume the message:", err);
      process.exit(1);
    }
  );
};

// Initializing the swagger documentation
swaggerDocs(app, port)

app.listen(port, async () => {
  console.log("Server listening on port 3000");
});

main().catch((err) => {
  error("Failed to initialize the app:", err);
  process.exit(1);
});
