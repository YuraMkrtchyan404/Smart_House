import { Request, Response } from "express"
import { MessageHandler } from "../utils/MessageHandler"
import { OwnerMessagingCodes } from "../utils/MessagingCodes.enum"

export class OwnerController{
    public static async registerOwnerMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(OwnerMessagingCodes.REGISTER_OWNER, { ...req.body }, req, res)
    }
    
    public static async loginOwnerMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(OwnerMessagingCodes.LOGIN_OWNER, { ...req.body }, req, res)
    }
}