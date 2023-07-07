import { HouseMessagingCodes } from "../utils/MessagingCodes.enum";
import { House } from "../models/House";

export class HouseService {

    public static async addHouse(information: { id: string, type: HouseMessagingCodes, data: any }) {
        const data: any = information.data
        const house = await new House(data).saveHouse(data)
        return { house: house }
    }

    public static async getHouses() {
        return await House.getHouses()
    }

    public static async getHouse(information: { id: string, type: HouseMessagingCodes, data: any }) {
        const house_id: number = parseInt(information.data.house_id)
        const house = await House.getHouse(house_id)
        return house
    }

    public static async deleteHouse(information: { id: string; type: HouseMessagingCodes; data: any; }) {
        const data: any = information.data
        const house = await House.deleteHouse(parseInt(data.house_id))
        return house
    }
}

