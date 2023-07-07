import { PrismaConnection } from "../utils/PrismaConnection";
import { Door } from "./Door";
import { Window } from "./Window";
import _ from 'lodash'

export class House {
    private house_id?: number | undefined
    private door: Door;
    private windows: Window[] = [];

    constructor(information: any) {
        if (information.house_id) {
            this.house_id = information.house_id
        }

        const numberOfWindows = parseInt(information.numberOfWindows)
        for (let i = 0; i < numberOfWindows; i++) {
            this.windows.push(new Window(information))
        }

        this.door = new Door(information)
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

    public async saveHouse(information: any) {
        try {
            const houseFromDb = await PrismaConnection.prisma.houses.create({})
            const informationAndMore = _.set(information, 'house_id', houseFromDb.house_id)
            const doorFromDb = await this.door.saveDoor(informationAndMore)

            const windowsFromDb = [];
            for (const window of this.windows) {
                const windowFromDb = await window.saveWindow(informationAndMore);
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

    public static async getHouse(house_id: number) {
        try{
            const [door, windows, houseJson] = await Promise.all([
                await Door.findDoorByHouseId(house_id),
                await Window.findWindows(house_id),
                { house_id: house_id }
            ]);
    
            const doorJson = await Door.generateDoorJson(door.door_id);
    
            const windowJsons = await Promise.all(
                windows.map(window => Window.generateWindowJson(window.window_id))
            );
    
            const pre_result = _.set(houseJson, 'door', doorJson);
            const result = _.set(pre_result, 'windows', windowJsons);
            return result;
        }catch(error){
            console.log('Error while getting the house: ', error)
            throw error
        }
    }

    public static async getHouses() {
        try {
            const housesFromDb = await PrismaConnection.prisma.houses.findMany({
                select: { house_id: true }
            })

            const houseCompleteJsons = []
            for (const house of housesFromDb) {
                const houseJson = await this.getHouse(house.house_id);
                houseCompleteJsons.push(houseJson)
            }
            return houseCompleteJsons
        }
        catch (error) {
            console.log('Error while getting houses: ', error)
            throw error
        }
    }

    public static async deleteHouse(house_id: number) {
        try {
            const deletedHouse = await this.getHouse(house_id)

            // Find the house with the given house_id
            const house = await PrismaConnection.prisma.houses.findUnique({
                where: { house_id: house_id },
            });

            if (!house) {
                throw new Error(`House with house_id ${house_id} not found`);
            }

            // Delete the associated door
            await Door.deleteDoorByHouseId(house_id);

            // Delete the associated windows
            await Window.deleteWindowsByHouseId(house_id);

            // Delete the house
            await PrismaConnection.prisma.houses.delete({
                where: { house_id: house_id },
            });

            return deletedHouse 

        } catch (error) {
            console.error('Error while deleting the house: ', error);
            throw error;
        }
    }
}