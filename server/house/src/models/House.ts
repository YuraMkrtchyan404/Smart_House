import { log } from "console";
import { PrismaConnection } from "../utils/PrismaConnection";
import { Door } from "./Door";
import { Window } from "./Window";
import _ from 'lodash'

/**
 * Model class for accessing and modifying house data 
 */
export class House {
    private house_id?: number | undefined
    private door: Door
    private windows: Window[] = []
    private owner_id: number;

    constructor(owner_id: number, numberOfWindows: number, pincode: string, house_id?: number) {
        console.log('numberOfWindows 2: ' + house_id)
        if (house_id) {
            this.house_id = house_id
        }
        this.owner_id = owner_id
        for (let i = 0; i < numberOfWindows; i++) {
            this.windows.push(new Window(pincode))
        }
        this.door = new Door(pincode)
    }

    public getOwner_id(): number {
        return this.owner_id;
    }
    public setOwner_id(value: number) {
        this.owner_id = value;
    }
    public getWindows(): Window[] {
        return this.windows;
    }
    public setWindows(value: Window[]) {
        this.windows = value;
    }
    public getDoor(): Door {
        return this.door;
    }
    public setDoor(value: Door) {
        this.door = value;
    }
    public getHouse_id(): number | undefined {
        return this.house_id;
    }
    public setHouse_id(house_id: number) {
        this.house_id = house_id
    }
    /**
     * Posts the house to db
     * @returns House complete json
     */
    public async saveHouse() {
        try {
            const houseFromDb = await PrismaConnection.prisma.houses.create({
                data: {
                    owner_id: this.owner_id
                }
            })
            const house_id = houseFromDb.house_id
            const doorFromDb = await this.door.saveDoor(house_id)

            const windowsFromDb = [];
            for (const window of this.windows) {
                const windowFromDb = await window.saveWindow(house_id);
                windowsFromDb.push(windowFromDb);
            }

            const pre_result = _.set(houseFromDb, 'door', doorFromDb)
            const result = _.set(pre_result, 'windows', windowsFromDb)
            return result
        }
        catch (error) {
            console.log('Error while adding new house: ', error)
            throw error
        }
    }
    /**
     * Finds house by house_id
     * @param house_id 
     * @returns House complete json
     */
    public static async getHouse(house_id: number) {
        try {
            const [houseJson, door, windows] = await Promise.all([
                await House.findHouse(house_id),
                await Door.findDoorByHouseId(house_id),
                await Window.findWindows(house_id),
            ]);

            log(`houseJson: ${JSON.stringify(houseJson)}`)
            log(`door: ${door}`)
            log(`windows: ${JSON.stringify(windows)}`)

            const doorJson = await Door.generateDoorJson(door!.door_id);
            const pre_result = _.set(houseJson, 'door', doorJson);
            const result = _.set(pre_result, 'windows', windows);
            log(result)
            return result;
        } catch (error) {
            console.log('Error while getting the house: ', error)
            throw error
        }
    }

    /**
     * Generates the list of houses by owner_id
     * @param owner_id 
     * @returns Array of House complete jsons
     */
    public static async getHouses(owner_id: number) {
        try {
            const housesFromDb = await PrismaConnection.prisma.houses.findMany({
                select: { house_id: true },
                where: { owner_id: owner_id }
            })

            const houseCompleteJsons = []
            for (const house of housesFromDb) {
                const houseJson = await this.getHouse(house.house_id);
                houseCompleteJsons.push(houseJson)
            }
            console.log(`houseCompleteJsons: ${houseCompleteJsons}`)
            return houseCompleteJsons
        }
        catch (error) {
            console.log('Error while getting houses: ', error)
            throw error
        }
    }

    /**
     * Deletes a house from database
     * @param house_id 
     * @returns House complete json
     */
    public static async deleteHouse(house_id: number) {
        try {
            const deletedHouse = await this.getHouse(house_id)
            const house = await PrismaConnection.prisma.houses.findUnique({
                where: { house_id: house_id },
            });

            if (!house) {
                throw new Error(`House with house_id ${house_id} not found`);
            }
            await Door.deleteDoorByHouseId(house_id);
            await Window.deleteWindowsByHouseId(house_id);
            await PrismaConnection.prisma.houses.delete({
                where: { house_id: house_id },
            });

            return deletedHouse

        } catch (error) {
            console.error('Error while deleting the house: ', error);
            throw error;
        }
    }

    /**
     * Finds house from db by house_id
     * @param house_id 
     * @returns House non-comlete json
     */
    public static async findHouse(house_id: number) {
        try {
            const house = await PrismaConnection.prisma.houses.findUniqueOrThrow({
                where: { house_id: house_id },
            })
            return house
        } catch (error) {
            console.error('Error while getting the house: ', error)
            throw error
        }
    }
}