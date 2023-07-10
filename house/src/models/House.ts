import { PrismaConnection } from "../utils/PrismaConnection";
import { Door } from "./Door";
import { Window } from "./Window";
import _ from 'lodash'

export class House {
    private house_id?: number | undefined
    private door: Door
    private windows: Window[] = []
    private owner_id: number;

    constructor(owner_id: number, numberOfWindows: number, pincode: string, house_id?: number) {
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

    public static async getHouse(house_id: number) {
        try {
            const [door, windows, houseJson] = await Promise.all([
                await Door.findDoorByHouseId(house_id),
                await Window.findWindows(house_id),
                await House.findHouse(house_id)
            ]);

            const doorJson = await Door.generateDoorJson(door.door_id);

            const windowJsons = await Promise.all(
                windows.map(window => Window.generateWindowJson(window.window_id))
            );

            const pre_result = _.set(houseJson, 'door', doorJson);
            const result = _.set(pre_result, 'windows', windowJsons);
            return result;
        } catch (error) {
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

    public static async findHouse(house_id: number) {
        try {
            const house = await PrismaConnection.prisma.houses.findUniqueOrThrow({
                where: { house_id: house_id },
            })
            return house
        } catch (error) {
            console.error('Error while getting the door: ', error)
            throw error
        }
    }
}