import { Door } from "../models/Door";
import { HouseMessagingCodes } from "../utils/MessagingCodes.enum";

export class DoorService{
    public static async controlDoor(information: { id: string; type: HouseMessagingCodes; data: any; }) {
        const data: any = information.data
        const result = await Door.controlDoor(data)
        return { ...result }
    }
}