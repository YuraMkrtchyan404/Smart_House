import { log } from "console"
import { OwnerMessagingCodes } from "./MessagingCodes.enum"
import { RabbitMQConnection } from "./RabbitMQConnection"
import * as amqp from "amqplib"
import { OwnerService } from "../services/OwnerService"

/**
 * Class for handling request and response messages from RabbitMQ
 */
export class MessageHandler {

    /**
     * Handles the request message received from RabbitMQ and sends a response message back
     * @param msg 
     * @param queueName 
     */
    public static async handleMessage(msg: amqp.ConsumeMessage | null, queueName: string) {
        const informationString: string = msg!.content.toString('utf8')
        const information: {id: string, type: OwnerMessagingCodes, data: any} = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)

        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    /**
     * Manipulates the database using CRUD operationsv
     * @param information 
     * @param queueName 
     * @returns House, door, window json object or an error message
     */
    private static async manipulateDatabase(information: {id: string, type: OwnerMessagingCodes, data: any}, queueName: string) {
        try {
            return await MessageHandler.executeCRUD(information)
        } catch (error: any) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error.message }, queueName)
        }
    }

    /**
     * Depending on what type of request is sent, calls the corresponding service method to execute CRUD operations
     * on House and its components
     * @param information 
     * @returns House, door, window json object or an error message 
     */
    private static async executeCRUD(information: {id: string, type: OwnerMessagingCodes, data: any}) {

        const messageDestination: OwnerMessagingCodes = information.type
        const data: any = information.data

        switch (messageDestination) {
            case OwnerMessagingCodes.REGISTER_OWNER:
                return await OwnerService.registerOwner(data)

            case OwnerMessagingCodes.LOGIN_OWNER:
                return await OwnerService.loginOwner(data)

            default:
                log("Invalid message destination")
                break
        }
    }

    /**
     * Constructs a response json and sends it to RabbitMQ
     * @param responseObject 
     * @param queueName 
     * @param messageId 
     */
    private static async sendResponseToQueue(responseObject: any, queueName: string, messageId: string) {
        if (responseObject) {
            await RabbitMQConnection.sendMessage({
                id: messageId,
                data: { ...responseObject },
            }, queueName)
        }
    }
}