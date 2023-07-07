import { Router } from 'express'
import { HouseController } from '../controllers/HouseController'
import { AuthenticateMiddleware } from '../middlewares/Authenticate.middleware'

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
        
        this.router.get('/houses', AuthenticateMiddleware.authenticate, HouseController.getAllHousesMessage)
        this.router.get('/house/:house_id', AuthenticateMiddleware.authenticate, HouseController.getHouseMessage)
        this.router.post('/house/new', AuthenticateMiddleware.authenticate, HouseController.addNewHouseMessage)
        this.router.put('/house/door/:door_id/control', AuthenticateMiddleware.authenticate, HouseController.doorControlMessage)
        this.router.put('/house/window/:window_id/control', AuthenticateMiddleware.authenticate, HouseController.windowControlMessage)
        this.router.delete('/house/:house_id', AuthenticateMiddleware.authenticate, HouseController.deleteHouseMessage)

        this.router.post('/house/window/new', AuthenticateMiddleware.authenticate, HouseController.addNewWindowMessage)
        this.router.get('/house/:house_id/windows', AuthenticateMiddleware.authenticate, HouseController.getWindowsMessage)
    }
}
