import { Request, Response } from "express"
import { RabbitMQConnection } from "./RabbitMQConnection"
import { log } from "console"
import { MessagingCodes } from "./MessagingCodes.enum"
import { v4 as uuidv4 } from "uuid"
import * as amqp from "amqplib"
import { QUEUE_1 } from ".."

export class MessageHandler {
    public static requestIdMap: Map<string, { req: Request; res: Response }> = new Map()
    public static token: string

    public static async sendMessageToQueue(messageType: MessagingCodes, requestData: any, req: Request, res: Response): Promise<string> {
        try {
            const messageId = uuidv4()
            const message = {
                id: messageId,
                type: messageType,
                data: requestData,
            }

            await RabbitMQConnection.sendMessage(message, QUEUE_1)
            MessageHandler.setRequestData(messageId, req, res)
            return messageId
        } catch (error) {
            log(error)
            throw new Error("Failed to send message to queue.")
        }
    }

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

    private static setRequestData(messageId: string, req: Request, res: Response) {
        MessageHandler.requestIdMap.set(messageId, { req, res })
    }
}
