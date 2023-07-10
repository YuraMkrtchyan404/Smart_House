import { HouseMessagingCodes } from "../utils/MessagingCodes.enum";
import { House } from "../models/House";
import { log } from "console";

export class HouseService {

    public static async addHouse(data: {pincode: string, numberOfWindows: number, decodedOwner: any}) {
        const house = await new House(parseInt(data.decodedOwner.id), data.numberOfWindows, data.pincode).saveHouse()
        log('HERE11111')
        return { house: house }
    }

    public static async getHouses() {
        return await House.getHouses()
    }

    public static async getHouse(data: {house_id: string, decodedOwner: any}) {
        const house_id: number = parseInt(data.house_id)
        const house = await House.getHouse(house_id)
        if (data.decodedOwner.id === house.owner_id) {
            return house
        } else {
            throw new Error('Unauthorized: Cannot view other owner\'s house details')
        }
    }

    public static async deleteHouse(data: {house_id: string, decodedOwner: any}) {
        const house_id = parseInt(data.house_id)
        if (data.decodedOwner.id === (await House.findHouse(house_id)).owner_id) {
            const house = await House.deleteHouse(house_id)
            return house
        } else {
            throw new Error('Unauthorized: Cannot delete other owner\'s house')
        }
    }
}

