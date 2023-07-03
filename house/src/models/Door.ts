import { log } from "console"
import { PrismaConnection } from "../utils/PrismaConnection"
import { Window } from "./Window"
import { Sensor } from "./Sensor"
import _ from 'lodash'

export class Door {
    private door_id?: number
    private sensor: Sensor

    constructor(information: any) {
        if (information.door_id) {
            this.door_id = information.door_id
        }
        this.sensor = new Sensor(information.pincode)
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

    public async saveDoor(data: any) {
        const sensorFromDb = await this.sensor.saveSensor()
        const doorFromDb = await PrismaConnection.prisma.doors.create({
            data: {
                sensor_id: sensorFromDb.sensor_id,
                house_id: data.house_id,
            },
        })

        const result = _.set(doorFromDb, 'sensor', sensorFromDb)
        return result
    }

    public static async controlDoor(data: any) {
        log(data)
        const door_id: number = parseInt(data.door_id)
        const door = await this.findDoor(door_id)

        //CHECK FOR OPEN WINDOWS
        const house_id = door.house_id
        const windowsFromDb = await Window.findWindows(house_id)
        const thereIsOpenWindow = windowsFromDb.some(window => window.sensor.state === 'OPEN')

        //UPDATE THE SENSOR
        const sensor_id = door.sensor_id
        const dataWithSensorId = _.set(data, "sensor_id", sensor_id)
        const updatedSensor = await Sensor.updateState(dataWithSensorId)

        //GENERATE RESULTING JSON
        let result = {}
        if (thereIsOpenWindow) {
            result = _.set(result, 'warning', 'There are open windows in the house')
        }
        const updatedDoorFromDb = await this.generateDoorJson(door_id)
        return _.set(result, 'door', updatedDoorFromDb)
    }

    public static async generateDoorJson(door_id: number) {
        const door = await this.findDoor(door_id)
        const sensor_id = door.sensor_id
        const sensor = await Sensor.findSensor(sensor_id)
        return _.set(door, 'sensor', sensor)
    }

    private static async findDoor(door_id: number) {
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