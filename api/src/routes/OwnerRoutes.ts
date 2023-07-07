import { Router } from 'express'
import { OwnerController } from '../controllers/OwnerController'

export class OwnerRoutes {
    private router: Router

    constructor() {
        this.router = Router()
        this.setupRoutes()
    }

    public getRouter() {
        return this.router
    }

    private setupRoutes() {
        
        this.router.post('/owner/register', OwnerController.registerOwnerMessage)
        this.router.post('/owner/login', OwnerController.loginOwnerMessage)
    }
}
