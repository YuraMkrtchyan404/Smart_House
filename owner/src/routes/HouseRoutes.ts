import { Router } from 'express'
import { HouseController } from '../controllers/HouseController'

export class HouseRoutes {
    private router: Router

    constructor() {
        this.router = Router()
        this.setupRoutes()
    }

    public getRouter() {
        return this.router
    }

    private setupRoutes() {
        this.router.post('/house/new', HouseController.addNewHouseMessage)
        this.router.put('/house/door/:door_id/control', HouseController.doorControlMessage)
        this.router.put('/house/window/:window_id/control', HouseController.windowControlMessage)
    }
}
