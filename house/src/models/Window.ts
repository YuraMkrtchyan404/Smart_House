import { Sensor } from "./Sensor"
import { PrismaConnection } from "../utils/PrismaConnection"
import _ from 'lodash'

export class Window {

    private window_id?: number
    private sensor: Sensor

    constructor(pincode: string, window_id?: number) {
        if (window_id) {
            this.window_id = window_id
        }
        this.sensor = new Sensor(pincode)
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

    public async saveWindow(house_id: number) {
        const sensorFromDb = await this.sensor.saveSensor()
        const windowFromDb = await PrismaConnection.prisma.windows.create({
            data: {
                sensor_id: sensorFromDb.sensor_id,
                house_id: house_id,
            },
        })

        return Window.generateWindowJson(windowFromDb.window_id)
    }

    public static async controlWindow(window_id: number, sentPin: string, sentState: string) {
        const window = await this.findWindow(window_id)

        //UPDATE THE SENSOR
        const sensor_id = window.sensor_id
        await Sensor.updateState(sensor_id, sentPin, sentState)

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

    public static async deleteWindowsByHouseId(house_id: number) {
        try {
            // Find the windows associated with the given house_id
            const windows = await this.findWindows(house_id)
    
            if (!windows || windows.length === 0) {
                throw new Error(`No windows associated with house_id ${house_id} found`);
            }
    
            // Delete each window
            for (const window of windows) {
                await Window.deleteWindow(window.window_id)
            }
    
            console.log(`Windows associated with house_id ${house_id} have been deleted`);
        } catch (error) {
            console.error('Error while deleting the windows: ', error);
            throw error;
        }
    }

    private static async deleteWindow(window_id: number) {
        const window = await PrismaConnection.prisma.windows.delete({
            where: { window_id: window_id },
        })
        await Sensor.deleteSensor(window.sensor_id)
    }

    public static async generateWindowJson(window_id: number): Promise<any> {
        const window = await this.findWindow(window_id)
        const sensor_id = window.sensor_id
        const sensor = await Sensor.findSensor(sensor_id)
        return _.set(window, 'sensor', sensor)
    }

    public static async findWindow(window_id: number) {
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