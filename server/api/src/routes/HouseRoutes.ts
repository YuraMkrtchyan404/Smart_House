import { Router } from 'express'
import { HouseController } from '../controllers/HouseController'
import { AuthenticateMiddleware } from '../middlewares/Authenticate.middleware'

/**
 * Router class for House routes
 */
export class HouseRoutes {
    private router: Router

    constructor() {
        this.router = Router()
        this.setupRoutes()
    }

    public getRouter() {
        return this.router
    }

    /**
     * Connects the routes and their corresponding controllers.
     * Defines the Swagger documentation for each endpoint.
     */
    private setupRoutes() {
        /**
        * @openapi
        * /houses:
        *   get:
        *     summary: Get all houses
        *     description: Get all houses of the logged owner
        *     tags:
        *       - House
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/HouseList'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.get('/houses', AuthenticateMiddleware.authenticate, HouseController.getAllHousesMessage)
        /**
        * @openapi
        * /houses/{house_id}:
        *   get:
        *     summary: Get house details
        *     description: Get house details by house id
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: house_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the house to retrieve
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/House'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.get('/houses/:house_id', AuthenticateMiddleware.authenticate, HouseController.getHouseMessage)
        /**
        * @openapi
        * /houses/new:
        *   post:
        *     summary: Add new house
        *     description: Add new house to the owner
        *     tags:
        *       - House
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/CreateHouseInput'
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/House'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.post('/houses/new', AuthenticateMiddleware.authenticate, HouseController.addNewHouseMessage)
        /**
        * @openapi
        * /houses/doors/{door_id}/control:
        *   put:
        *     summary: Control a door
        *     description: Control a door by its id
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: door_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the door to control
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/DoorControlInput'
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/Door'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.put('/houses/doors/:door_id/control', AuthenticateMiddleware.authenticate, HouseController.doorControlMessage)
        /**
        * @openapi
        * /houses/windows/{window_id}/control:
        *   put:
        *     summary: Control a window
        *     description: Control a window by its id
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: window_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the window to control
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/WindowControlInput'
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/Window'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.put('/houses/windows/:window_id/control', AuthenticateMiddleware.authenticate, HouseController.windowControlMessage)
        /**
        * @openapi
        * /houses/{house_id}:
        *   delete:
        *     summary: Delete a house
        *     description: Delete a house by house ID
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: house_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the house to delete
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/House'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.delete('/houses/:house_id', AuthenticateMiddleware.authenticate, HouseController.deleteHouseMessage)
        /**
        * @openapi
        * /houses/{house_id}/windows/new:
        *   post:
        *     summary: Add new house window
        *     description: Add new window to a house by house ID
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: house_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the house
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/CreateWindowInput'
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/Window'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.post('/houses/:house_id/windows/new', AuthenticateMiddleware.authenticate, HouseController.addNewWindowMessage)
        /**
        * @openapi
        * /houses/:house_id/windows:
        *   get:
        *     summary: Get all windows of a house
        *     description: Get all windows of a house by house ID
        *     tags:
        *       - House
        *     parameters:
        *       - in: path
        *         name: house_id
        *         schema:
        *           type: integer
        *         required: true
        *         description: ID of the house
        *     responses:
        *       200:
        *         description: Successful operation
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/Windows'
        *       401:
        *         description: Unauthorized
        *       404:
        *         description: Not Found
        *       500:
        *         description: Internal server error
        */
        this.router.get('/houses/:house_id/windows', AuthenticateMiddleware.authenticate, HouseController.getWindowsMessage)
    }
}
