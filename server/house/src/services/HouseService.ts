import { House } from "../models/House";
import { log } from "console";

export class HouseService {

    public static async addHouse(data: { pincode: string, numberOfWindows: string, decodedOwner: any }) {
        const house = await new House(parseInt(data.decodedOwner.id), parseInt(data.numberOfWindows), data.pincode).saveHouse()
        log(house)
        return { house: house }
    }

    public static async getHouses(data: { decodedOwner: any }) {
        return await House.getHouses(parseInt(data.decodedOwner.id))
    }

    public static async getHouse(data: { house_id: string, decodedOwner: any }) {
        try {
            const house_id: number = parseInt(data.house_id)
            const house = await House.getHouse(house_id)
            if (parseInt(data.decodedOwner.id) === house.owner_id) {
                return house
            } else {
                throw new Error('Unauthorized: Cannot view other owner\'s house details')
            }
        } catch (error) {
            log('Error: ' + error)
            throw error
        }
    }

    public static async deleteHouse(data: { house_id: string, decodedOwner: any }) {
        log('house_id 3: ' + data.decodedOwner)
        const house_id = parseInt(data.house_id)
        if (parseInt(data.decodedOwner.id) === (await House.findHouse(house_id)).owner_id) {
            const house = await House.deleteHouse(house_id)
            return house
        } else {
            throw new Error('Unauthorized: Cannot delete other owner\'s house')
        }
    }
}

