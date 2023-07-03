import { PrismaConnection } from "../utils/PrismaConnection"
import { State } from "../utils/State.enum"
import _ from 'lodash'


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

    public async saveSensor() {
        const stateName = State[this.state]
        const sensorFromDb = await PrismaConnection.prisma.sensors.create({
            data: {
                state: stateName,
                pincode: this.pincode,
            },
        })
        const sensorWithoutPin = _.omit(sensorFromDb, 'pincode')
        return sensorWithoutPin
    }

    public static async updateState(data: any): Promise<any> {
        try {
            if(await this.correctPin(data)){
                const sensor_id = parseInt(data.sensor_id)
                const sensorFromDb = await this.findSensor(sensor_id)
                const currentState: string = (sensorFromDb).state
                const newState: string = data.state
                
                if (currentState === newState) {
                    throw new Error('The sensor is already in the state of ' + newState)
                }
                else{
                    const updatedSensor = PrismaConnection.prisma.sensors.update({
                        where: { sensor_id: sensorFromDb.sensor_id },
                        data: {
                            pincode: sensorFromDb.pincode,
                            state: newState
                        }
                    })
                    return updatedSensor
                }
            }
            else{
                return { error: 'Wrong PIN' }
            }
        } catch (error) {
            throw error
        }
    }

    public static async findSensor(sensor_id: number) {
        try {
            if (!sensor_id) {
                throw new Error('Cannot find sensor without ID')
            }
            const sensor = await PrismaConnection.prisma.sensors.findUniqueOrThrow({
                where: { sensor_id: sensor_id },
            })
            return sensor
        } catch (error) {
            console.error('Error while getting the sensor: ', error)
            throw error
        }
    }

    private static async correctPin(data: any) {
        try{
            const sensor_id = parseInt(data.sensor_id)
            const sentPin = data.pincode
            const actualPin = (await this.findSensor(sensor_id)).pincode
            return sentPin === actualPin
        } catch(error){
            console.error('Error while checking the PIN: ', error)
            throw error
        }
    }
}