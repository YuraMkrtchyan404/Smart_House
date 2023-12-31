import { PrismaConnection } from "../utils/PrismaConnection"
import { State } from "../utils/State.enum"
import _ from 'lodash'
import bcrypt from 'bcrypt'

/**
 * Model class for accessing and modifying sensor data 
 */
export class Sensor {
    private sensor_id?: number
    private state: State
    private pincode: string

    constructor(pincode: string, sensor_id?: number) {
        this.pincode = pincode
        if (sensor_id) {
            this.sensor_id = sensor_id
        }
        this.state = State.CLOSED
    }

    public getId(): number | undefined {
        return this.sensor_id
    }
    public setId(id: number) {
        this.sensor_id = id
    }
    public getState(): State | undefined {
        return this.state
    }
    public setState(value: State) {
        this.state = value
    }
    public getPincode(): string {
        return this.pincode
    }
    public changePincode(value: string) {
        this.pincode = value
    }

    /**
     * Posts the sensor to the database
     * @returns A Promise that resolves to an object containing the sensor_id and state of the saved sensor.
     */
    public async saveSensor(): Promise<{ sensor_id: number; state: string }> {
        try {
            if (this.pincode) {
                const hashedPincode: string = await bcrypt.hash(this.pincode, 10)
                this.pincode = hashedPincode
            }
            const stateName = State[this.state]
            const sensorFromDb = await PrismaConnection.prisma.sensors.create({
                data: {
                    state: stateName,
                    pincode: this.pincode,
                },
            })
            const sensorWithoutPin = _.omit(sensorFromDb, 'pincode')
            return sensorWithoutPin
        } catch (error) {
            console.log('Error while adding new sensor: ', error)
            throw error
        }
    }

    /**
     * Updates the state of the sensor to the sentState
     * @param sensor_id 
     * @param sentPin 
     * @param sentState 
     * @returns A Promise that resolves to an object containing the sensor_id, pincode and state of the saved sensor.
     */
    public static async updateState(sensor_id: number, sentPin: string, sentState: string): Promise<any> {
        try {
            if (await this.correctPin(sensor_id, sentPin)) {
                const sensorFromDb = await this.findSensor(sensor_id)
                const currentState: string = (sensorFromDb).state

                if (currentState === sentState) {
                    throw new Error('The sensor is already in the state of ' + sentState)
                }
                else {
                    const updatedSensor = PrismaConnection.prisma.sensors.update({
                        where: { sensor_id: sensorFromDb.sensor_id },
                        data: {
                            pincode: sensorFromDb.pincode,
                            state: sentState
                        }
                    })
                    return updatedSensor
                }
            }
            else {
                return { error: 'Wrong PIN' }
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Finds the sensor from db by sensor_id
     * @param sensor_id 
     * @returns A Promise that resolves to sensor json
     */
    public static async findSensor(sensor_id: number) {
        try {
            const sensor = await PrismaConnection.prisma.sensors.findUniqueOrThrow({
                where: { sensor_id: sensor_id },
            })
            return sensor
        } catch (error) {
            console.error('Error while getting the sensor: ', error)
            throw error
        }
    }

    /**
     * Deletes the sensor from bd
     * @param sensor_id 
     * @returns A Promise that resolves to sensor json
     */
    public static async deleteSensor(sensor_id: number) {
        try {
            const sensor = await PrismaConnection.prisma.sensors.delete({
                where: { sensor_id: sensor_id }
            })
            return sensor
        } catch (error) {
            console.error('Error while deleting the sensor: ', error)
        }
    }

    /**
     * Checks if the sent pin is correct
     * @param sensor_id 
     * @param sentPin 
     * @returns A Promise that resolves to a boolean value
     */
    private static async correctPin(sensor_id: number, sentPin: string) {
        try {
            const actualPin = (await this.findSensor(sensor_id)).pincode
            return bcrypt.compare(sentPin, actualPin)
        } catch (error) {
            console.error('Error while checking the PIN: ', error)
            throw error
        }
    }
}