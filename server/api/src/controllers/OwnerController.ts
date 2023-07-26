import { Request, Response } from "express"
import { MessageHandler } from "../utils/MessageHandler"
import { OwnerMessagingCodes } from "../utils/MessagingCodes.enum"

/**
 * Controller class for handling requests connected with owners
 */
export class OwnerController {

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the REGISTER_OWNER reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async registerOwnerMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(OwnerMessagingCodes.REGISTER_OWNER, { ...req.body }, req, res)
    }

    /**
     * Utilizes MessageHandler's sendMessageToQueue method to 
     * send the LOGIN_OWNER reqest information to the RabbitMQ queue
     * @param req 
     * @param res 
     */
    public static async loginOwnerMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(OwnerMessagingCodes.LOGIN_OWNER, { ...req.body }, req, res)
    }
}