import { log } from "console"
import { OwnerMessagingCodes } from "./MessagingCodes.enum"
import { RabbitMQConnection } from "./RabbitMQConnection"
import * as amqp from "amqplib"
import { OwnerService } from "../services/OwnerService"

export class MessageHandler {

    public static async handleMessage(msg: amqp.ConsumeMessage | null, queueName: string) {
        const informationString: string = msg!.content.toString('utf8')
        const information: {id: string, type: OwnerMessagingCodes, data: any} = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)

        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    private static async manipulateDatabase(information: {id: string, type: OwnerMessagingCodes, data: any}, queueName: string) {
        try {
            return await MessageHandler.executeCRUD(information)
        } catch (error: any) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error.message }, queueName)
        }
    }

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

    private static async sendResponseToQueue(responseObject: any, queueName: string, messageId: string) {
        if (responseObject) {
            await RabbitMQConnection.sendMessage({
                id: messageId,
                data: { ...responseObject },
            }, queueName)
        }
    }
}