import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from './RabbitMQConnection'
import { HouseMessagingCodes } from './MessagingCodes.enum'
import { HouseService } from '../services/HouseService'
import { DoorService } from '../services/DoorService'
import { WindowService } from '../services/WindowService'

export class MessageHandler {

    public static async handleMessage(msg: amqp.ConsumeMessage | null, queueName: string) {
        const informationString: string = msg!.content.toString('utf8')
        const information: {id: string, type: HouseMessagingCodes, data: any} = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)

        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    private static async manipulateDatabase(information: {id: string, type: HouseMessagingCodes, data: any}, queueName: string) {
        try {
            return await MessageHandler.executeCRUD(information)
        } catch (error: any) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error.message }, queueName)
        }
    }

    private static async executeCRUD(information: {id: string, type: HouseMessagingCodes, data: any}) {

        const messageDestination: HouseMessagingCodes = information.type

        switch (messageDestination) {

            case HouseMessagingCodes.ADD_HOUSE:
                return await HouseService.addHouse(information)

            case HouseMessagingCodes.CONTROL_DOOR:
                return await DoorService.controlDoor(information)

            case HouseMessagingCodes.CONTROL_WINDOW:
                return await WindowService.controlWindow(information)

            case HouseMessagingCodes.GET_HOUSES:
                return await HouseService.getHouses()

            case HouseMessagingCodes.GET_HOUSE:
                return await HouseService.getHouse(information)

            case HouseMessagingCodes.ADD_WINDOW:
                return await WindowService.addWindow(information)

            case HouseMessagingCodes.DELETE_HOUSE:
                return await HouseService.deleteHouse(information)

            case HouseMessagingCodes.GET_WINDOWS:
                return await WindowService.getWindows(information)

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