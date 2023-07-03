import { Door } from "../models/Door";
import { MessagingCodes } from "../utils/MessagingCodes.enum";

export class DoorService{
    public static async controlDoor(information: { id: string; type: MessagingCodes; data: any; }) {
        const data: any = information.data
        const result = await Door.controlDoor(data)
        return { ...result }
    }
}