import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from './RabbitMQConnection'
import { HouseMessagingCodes } from './MessagingCodes.enum'
import { HouseService } from '../services/HouseService'
import { DoorService } from '../services/DoorService'
import { WindowService } from '../services/WindowService'

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
        const information: {id: string, type: HouseMessagingCodes, data: any} = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)

        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    /**
     * Manipulates the database using CRUD operations
     * @param information 
     * @param queueName 
     * @returns House, door, window json object or an error message
     */
    private static async manipulateDatabase(information: {id: string, type: HouseMessagingCodes, data: any}, queueName: string) {
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
    private static async executeCRUD(information: {id: string, type: HouseMessagingCodes, data: any}) {

        const messageDestination: HouseMessagingCodes = information.type
        const data = information.data

        switch (messageDestination) {

            case HouseMessagingCodes.ADD_HOUSE:
                return await HouseService.addHouse(data)

            case HouseMessagingCodes.CONTROL_DOOR:
                return await DoorService.controlDoor(data)

            case HouseMessagingCodes.CONTROL_WINDOW:
                return await WindowService.controlWindow(data)

            case HouseMessagingCodes.GET_HOUSES:
                return await HouseService.getHouses(data)

            case HouseMessagingCodes.GET_HOUSE:
                return await HouseService.getHouse(data)

            case HouseMessagingCodes.ADD_WINDOW:
                return await WindowService.addWindow(data)

            case HouseMessagingCodes.DELETE_HOUSE:
                return await HouseService.deleteHouse(data)

            case HouseMessagingCodes.GET_WINDOWS:
                return await WindowService.getWindows(data)

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