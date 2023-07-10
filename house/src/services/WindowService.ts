import { House } from "../models/House";
import { Window } from "../models/Window";
import { HouseMessagingCodes } from "../utils/MessagingCodes.enum";

export class WindowService {
    public static async getWindows(data: { house_id: string, decodedOwner: any }) {
        const house_id: number = parseInt(data.house_id)
        const owner_id: number = (await House.findHouse(house_id)).owner_id

        if (parseInt(data.decodedOwner.id) === owner_id) {
            const windows = await Window.findWindows(house_id)
            return windows
        } else {
            throw new Error('Unauthorized: Cannot view other owner\'s house details')
        }
    }

    public static async controlWindow(data: { state: string, pincode: string, window_id: string, decodedOwner: any }) {
        const window_id: number = parseInt(data.window_id)
        const window = await Window.findWindow(window_id)
        const owner_id = (await House.findHouse(window.house_id!)).owner_id
        if (parseInt(data.decodedOwner.id) === owner_id) {
            const result = await Window.controlWindow(window_id, data.pincode, data.state)
            return { ...result }
        } else {
            throw new Error('Unauthorized: Cannot control other owner\'s property')
        }

    }

    public static async addWindow(data: { house_id: string, pincode: string, decodedOwner: any }) {
        const owner_id: number = (await House.findHouse(parseInt(data.house_id))).owner_id
        if (parseInt(data.decodedOwner.id) === owner_id) {
            const window = await new Window(data.pincode).saveWindow(parseInt(data.house_id))
            return { window: window }
        } else {
            throw new Error('Unauthorized: Cannot modify other owner\'s property')
        }
    }
}