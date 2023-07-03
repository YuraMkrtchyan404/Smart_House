import { Request, Response } from "express"
import { QUEUE_1 } from ".."
import { MessageHandler } from "../utils/MessageHandler"
import { MessagingCodes } from "../utils/MessagingCodes.enum"

export class HouseController {

    public static async addNewHouseMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.ADD_HOUSE, { ...req.body }, req, res)
    }

    public static async doorControlMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.CONTROL_DOOR, { door_id: req.params.door_id, ...req.body }, req, res)
    }

    public static async windowControlMessage(req: Request, res: Response) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.CONTROL_WINDOW, { window_id: req.params.window_id, ...req.body }, req, res)
    }
}