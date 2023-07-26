import { Request, Response } from "express"
import { RabbitMQConnection } from "./RabbitMQConnection"
import { log } from "console"
import { HouseMessagingCodes, MessagingCodes, OwnerMessagingCodes } from "./MessagingCodes.enum"
import { v4 as uuidv4 } from "uuid"
import * as amqp from "amqplib"
import { QUEUE_1, QUEUE_3 } from ".."

/**
 * Class for sending and receiving messages to and from RabbitMQ
 */
export class MessageHandler {
    /**
     * Static variable for mapping request-response pairs to a unique ID
     */
    public static requestIdMap: Map<string, { req: Request; res: Response }> = new Map()

    /**
     * Determines if a MessagingCode is HouseMessagingCode or not
     * @param code 
     * @returns A boolean indicating if the given code is of type HouseMessagingCodes.
     */
    private static isHouseMessagingCode(code: MessagingCodes): code is HouseMessagingCodes {
        return Object.values(HouseMessagingCodes).includes(code as HouseMessagingCodes);
    }

    /**
     * Determines if a MessagingCode is OwnerMessagingCode or not
     * @param code 
     * @returns A boolean indicating if the given code is of type OwnerMessagingCodes.
     */
    private static isOwnerMessagingCode(code: MessagingCodes): code is OwnerMessagingCodes {
        return Object.values(OwnerMessagingCodes).includes(code as OwnerMessagingCodes);
    }

    /**
     * Constructs a JSON with unique ID using the requset and messageType
     * Sends the JSON message to the corresponding RabbitMQ queue 
     * Maps the req and res to their unique ID
     * @param messageType 
     * @param requestData 
     * @param req 
     * @param res 
     * @returns A Promise that resolves to the unique ID of the sent message.
     */
    public static async sendMessageToQueue(messageType: MessagingCodes, requestData: any, req: Request, res: Response): Promise<string> {
        try {
            const messageId = uuidv4()
            const message = {
                id: messageId,
                type: messageType,
                data: requestData,
            }

            if (this.isHouseMessagingCode(messageType)) {
                await RabbitMQConnection.sendMessage(message, QUEUE_1);
                log('SENT TO QUEUE 1')
            } else if (this.isOwnerMessagingCode(messageType)) {
                await RabbitMQConnection.sendMessage(message, QUEUE_3);
                log('SENT TO QUEUE 3')
            }

            MessageHandler.setRequestData(messageId, req, res)
            return messageId
        } catch (error) {
            log(error)
            throw new Error("Failed to send message to queue.")
        }
    }

    /**
     * Method for receiving the response from RabbitMQ and setting it to the res.json 
     * @param msg 
     */
    public static async receiveResponse(msg: amqp.ConsumeMessage) {
        const informationString: string = msg.content.toString('utf8')
        const responseJson: any = JSON.parse(informationString)
        const id = responseJson.id
        const err = responseJson.error
        const data = responseJson.data
        if (err) {
            const response = MessageHandler.requestIdMap.get(id)?.res
            if (response) {
                response.status(404).json({ error: err })
            }
        } else {
            MessageHandler.requestIdMap.get(id)?.res.json({
                ...data,
            })
        }
        RabbitMQConnection.channel!.ack(msg)
    }

    /**
     * Maps the req-res pair to a string ID
     * @param messageId 
     * @param req 
     * @param res 
     */
    private static setRequestData(messageId: string, req: Request, res: Response) {
        MessageHandler.requestIdMap.set(messageId, { req, res })
    }
}
