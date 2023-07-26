import { log } from "console"
import { PrismaConnection } from "../utils/PrismaConnection"
import { Window } from "./Window"
import { Sensor } from "./Sensor"
import _ from 'lodash'

/**
 * Model class for accessing and modifying door data 
 */
export class Door {
    private door_id?: number
    private sensor: Sensor

    constructor(pincode: string, door_id?: number) {
        if (door_id) {
            this.door_id = door_id
        }
        this.sensor = new Sensor(pincode)
    }

    public getId(): number | undefined {
        return this.door_id
    }
    public getSensor(): Sensor {
        return this.sensor
    }
    public setSensor(sensor: Sensor) {
        this.sensor = sensor
    }

    /**
     * Posts the door to the database
     * @param house_id 
     * @returns Door complete json
     */
    public async saveDoor(house_id: number) {
        const sensorFromDb = await this.sensor.saveSensor()
        const doorFromDb = await PrismaConnection.prisma.doors.create({
            data: {
                sensor_id: sensorFromDb.sensor_id,
                house_id: house_id,
            },
        })

        const result = _.set(doorFromDb, 'sensor', sensorFromDb)
        return result
    }

    /**
     * OPENs or CLOSEs a door
     * @param door_id 
     * @param sentPin 
     * @param sentState 
     * @returns Door complete json
     */
    public static async controlDoor(door_id: number, sentPin: string, sentState: string) {
        const door = await this.findDoor(door_id)
        const sensor_id = door.sensor_id
        const house_id = door.house_id
        
        //CHECK FOR OPEN WINDOWS
        const windowsFromDb = await Window.findWindows(house_id)
        const thereIsOpenWindow = windowsFromDb.some(window => window.sensor.state === 'OPEN')
        
        //UPDATE THE SENSOR
        await Sensor.updateState(sensor_id, sentPin, sentState)

        //GENERATE RESULTING JSON
        let result = {}
        if (thereIsOpenWindow) {
            result = _.set(result, 'warning', 'There are open windows in the house')
        }
        const updatedDoorFromDb = await this.generateDoorJson(door_id)
        return _.set(result, 'door', updatedDoorFromDb)
    }

    /**
     * Deletes a door from db
     * @param house_id 
     */
    public static async deleteDoorByHouseId(house_id: number) {
        try {
            const door = await this.findDoorByHouseId(house_id)
            if (!door) {
                throw new Error(`Door associated with house_id ${house_id} not found`);
            }
            const sensor_id = door.sensor_id
            await Sensor.deleteSensor(sensor_id)

            await PrismaConnection.prisma.doors.delete({
                where: { house_id: house_id },
            });
    
            console.log(`Door associated with house_id ${house_id} has been deleted`);
        } catch (error) {
            console.error('Error while deleting the door: ', error);
            throw error;
        }
    }

    /**
     * Generates a complete door json by attaching to it its sensor's json
     * @param door_id 
     * @returns Door complete json
     */
    public static async generateDoorJson(door_id: number) {
        const door = await this.findDoor(door_id)
        const sensor_id = door.sensor_id
        const sensor = _.omit(await Sensor.findSensor(sensor_id), 'pincode')
        return _.set(door, 'sensor', sensor)
    }

    /**
     * Finds the door from db by house_id
     * @param house_id 
     * @returns Door non-complete json
     */
    public static async findDoorByHouseId(house_id: number) {
        try {
            const door = await PrismaConnection.prisma.doors.findUnique({
                where: { house_id: house_id },
            })
            return door
        } catch (error) {
            console.error('Error while getting the door: ', error)
            throw error
        }
    }

    /**
     * Finds the door from db by door_id
     * @param door_id 
     * @returns Door non-complete json 
     */
    public static async findDoor(door_id: number) {
        try {
            if (!door_id) {
                throw new Error('Cannot find door without ID')
            }
            const door = await PrismaConnection.prisma.doors.findUniqueOrThrow({
                where: { door_id: door_id },
            })
            return door
        } catch (error) {
            console.error('Error while getting the door: ', error)
            throw error
        }
    }
}