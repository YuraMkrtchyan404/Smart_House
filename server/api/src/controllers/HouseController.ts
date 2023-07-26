import { Request, Response } from "express"
import { MessageHandler } from "../utils/MessageHandler"
import { HouseMessagingCodes } from "../utils/MessagingCodes.enum"

/**
 * Controller class for handling request connected with houses
 */
export class HouseController {

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to
     * send the GET_WINDOWS reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async getWindowsMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.GET_WINDOWS, { house_id: req.params.house_id, ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to
     * send the ADD_HOUSE reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async addNewHouseMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.ADD_HOUSE, { ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the CONTROL_DOOR reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async doorControlMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.CONTROL_DOOR, { door_id: req.params.door_id, ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the CONTROL_WINDOW reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async windowControlMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.CONTROL_WINDOW, { window_id: req.params.window_id, ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the GET_HOUSES reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async getAllHousesMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.GET_HOUSES, { ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the GET_HOUSE reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async getHouseMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.GET_HOUSE, { house_id: req.params.house_id, ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the ADD_WINDOW reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async addNewWindowMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.ADD_WINDOW, { house_id: req.params.house_id, ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the DELETE_HOUSE reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async deleteHouseMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(HouseMessagingCodes.DELETE_HOUSE, { house_id: req.params.house_id, ...req.body }, req, res)
    }
}