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
}