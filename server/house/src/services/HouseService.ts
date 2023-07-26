import { House } from "../models/House";
import { log } from "console";

/**
 * Class for business logic connected with Houses
 */
export class HouseService {

    /**
     * Utilizes saveHouse method from House class to add a new house
     * @param data 
     * @returns House complete json
     */
    public static async addHouse(data: { pincode: string, numberOfWindows: string, decodedOwner: any }) {
        const house = await new House(parseInt(data.decodedOwner.id), parseInt(data.numberOfWindows), data.pincode).saveHouse()
        return { house: house }
    }

    /**
     * Utilizes getHouse method from House class to get the houses by logged owner's ID
     * @param data 
     * @returns Array of House complete jsons
     */
    public static async getHouses(data: { decodedOwner: any }) {
        return await House.getHouses(parseInt(data.decodedOwner.id))
    }

    /**
     * Utilizes getHouse method from House class to get a house data
     * @param data 
     * @returns House complete json
     */
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

    /**
     * Utilizes deleteHouse method from House class to delete a house
     * @param data 
     * @returns House complete json  
     */
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

