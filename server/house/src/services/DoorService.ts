import { log } from "console";
import { Door } from "../models/Door";
import { House } from "../models/House";

/**
 * Class for business logic connected with Doors
 */
export class DoorService {
    /**
     * Utilizes Door.controlDoor according to the received data
     * @param data 
     * @returns Door complete json
     */
    public static async controlDoor(data: { state: string, pincode: string, door_id: string, decodedOwner: any }) {
        const door_id: number = parseInt(data.door_id)
        const door = await Door.findDoor(door_id)
        const owner_id = (await House.findHouse(door.house_id)).owner_id

        if (parseInt(data.decodedOwner.id) === owner_id) {
            const result = await Door.controlDoor(door_id, data.pincode, data.state)
            return { ...result }
        } else {
            throw new Error('Unauthorized: Cannot control another owner\'s property')
        }
    }
}