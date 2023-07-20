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
        /**
         * @openapi
         * /owner/register:
         *  post:
         *      tags:
         *          - Owner
         *      summary: Resgister a new owner
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/CreateOwnerInput'
         *      responses:
         *          200:
         *              description: Successful registration.
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/LoginOwnerResponse'
         *          400:
         *              description: Invalid request data.
         *          401:
         *              description: Unauthorized
         *          404:
         *              description: Not Found
         *          500:
         *              description: Internal server error.
         */
        this.router.post('/owner/register', OwnerController.registerOwnerMessage)
        /**
         * @openapi
         * /owner/login:
         *  post:
         *      tags:
         *          - Owner
         *      summary: Log in an owner
         *      requestBody:
         *          description: Owner login credentials
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/LoginOwnerInput'
         *      responses:
         *          200:
         *              description: Successful login.
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/LoginOwnerResponse'
         *          400:
         *              description: Invalid request data.
         *          401:
         *              description: Unauthorized
         *          404:
         *              description: Not Found
         *          500:
         *              description: Internal server error.
         */
        this.router.post('/owner/login', OwnerController.loginOwnerMessage)
    }
}
