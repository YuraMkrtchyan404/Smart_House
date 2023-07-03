import { Window } from "../models/Window";
import { MessagingCodes } from "../utils/MessagingCodes.enum";

export class WindowService{
    public static async controlWindow(information: { id: string; type: MessagingCodes; data: any; }) {
        const data: any = information.data
        const result = await Window.controlWindow(data)
        return { ...result }
    }
}