import { Sensor } from "./Sensor"
import { PrismaConnection } from "../utils/PrismaConnection"
import _ from 'lodash'
import { log } from "console"

export class Window {

    private window_id?: number
    private sensor: Sensor

    constructor(information: any) {
        if (information.window_id) {
            this.window_id = information.window_id
        }
        this.sensor = new Sensor(information.pincode)
    }

    public getWindowId(): number | undefined {
        return this.window_id
    }
    public getSensor(): Sensor {
        return this.sensor
    }
    public setSensor(value: Sensor) {
        this.sensor = value
    }

    public async saveWindow(information: any) {
        const sensorFromDb = await this.sensor.saveSensor()
        const windowFromDb = await PrismaConnection.prisma.windows.create({
            data: {
                sensor_id: sensorFromDb.sensor_id,
                house_id: information.house_id,
            },
        })

        const result = _.set(windowFromDb, 'sensor', sensorFromDb)
        return result
    }

    public static async controlWindow(data: any) {
        log(data)
        const window_id: number = parseInt(data.window_id)
        const window = await this.findWindow(window_id)

        //UPDATE THE SENSOR
        const sensor_id = window.sensor_id
        const dataWithSensorId = _.set(data, "sensor_id", sensor_id)
        await Sensor.updateState(dataWithSensorId)

        //GENERATE RESULTING JSON
        let result = {}
        const updatedWindowFromDb = await this.generateWindowJson(window_id)
        return _.set(result, 'window', updatedWindowFromDb)

    }

    public static async findWindows(house_id: number) {
        const windows = await PrismaConnection.prisma.windows.findMany({
            where: { house_id: house_id }
        })
        const windowsCompleteJsonList = []
        for (const window of windows) {
            windowsCompleteJsonList.push(await this.generateWindowJson(window.window_id))
        }
        return windowsCompleteJsonList
    }

    public static async generateWindowJson(window_id: number): Promise<any> {
        const window = await this.findWindow(window_id)
        const sensor_id = window.sensor_id
        const sensor = await Sensor.findSensor(sensor_id)
        return _.set(window, 'sensor', sensor)
    }

    private static async findWindow(window_id: number) {
        try {
            if (!window_id) {
                throw new Error('Cannot find window without ID')
            }
            const window = await PrismaConnection.prisma.windows.findUniqueOrThrow({
                where: { window_id: window_id },
            })
            return window
        } catch (error) {
            console.error('Error while getting the window: ', error)
            throw error
        }
    }
}