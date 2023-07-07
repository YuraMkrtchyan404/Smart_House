import { Window } from "../models/Window";
import { HouseMessagingCodes } from "../utils/MessagingCodes.enum";

export class WindowService{
    public static async getWindows(information: { id: string; type: HouseMessagingCodes; data: any; }) {
        const house_id: number = parseInt(information.data.house_id)
        const windows = await Window.findWindows(house_id)
        return windows
    }

    public static async controlWindow(information: { id: string; type: HouseMessagingCodes; data: any; }) {
        const data: any = information.data
        const result = await Window.controlWindow(data)
        return { ...result }
    }
    
    public static async addWindow(information: { id: string; type: HouseMessagingCodes; data: any; }) {
        const data: any = information.data
        const window = await new Window(data).saveWindow(data)
        return { window: window }
    }
}