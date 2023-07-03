import { MessagingCodes } from "../utils/MessagingCodes.enum";
import { House } from "../models/House";
import { Door } from "../models/Door";

export class HouseService {

    public static async addHouse(information: { id: string, type: MessagingCodes, data: any }) {
        const data: any = information.data
        const house = await new House(data).saveHouse(data)
        return { house: house }
    }
}

