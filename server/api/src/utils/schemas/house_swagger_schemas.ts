/**
 * @openapi
 * components:
 *   schemas:
 *     HouseList:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/House'
 * 
 *     House:
 *       type: object
 *       properties:
 *         house_id:
 *           type: integer
 *           default: 1
 *         owner_id:
 *           type: integer
 *           default: 1
 *         door:
 *           $ref: '#/components/schemas/Door'
 *         windows:
 *           $ref: '#/components/schemas/Windows'
 * 
 *     Windows:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Window'
 * 
 *     Window:
 *       type: object
 *       properties:
 *         window_id:
 *           type: integer
 *           default: 1
 *         sensor_id:
 *           type: integer
 *           default: 1
 *         house_id:
 *           type: integer
 *           default: 1
 *         sensor:
 *           $ref: '#components/schemas/Sensor'
 
 *     Door:
 *       type: object
 *       properties:
 *         door_id:
 *           type: integer
 *           default: 1
 *         sensor_id:
 *           type: integer
 *           default: 1
 *         house_id:
 *           type: integer
 *           default: 1
 *         sensor:
 *           $ref: '#components/schemas/Sensor'
 * 
 *     Sensor:
 *       type: object
 *       properties:
 *         sensor_id:
 *           type: integer
 *           default: 1
 *         state:
 *           type: string
 *           default: CLOSED
 * 
 *     CreateHouseInput:
 *       type: object
 *       properties:
 *         pincode:
 *           type: string
 *           description: The default pincode for the house's door and windows  
 *           default: 12345
 *         numberOfWindows:
 *           type: integer
 *           description: The number of windows in the house
 *           default: 1
 *
 *     DoorControlInput:
 *       type: object
 *       properties:
 *         state:
 *           type: string
 *           description: The command to control the door (e.g., OPEN, CLOSE).
 *           default: CLOSED
 *         pincode:
 *           type: string
 *           description: The pincode for authorization.
 *           default: 12345
 * 
 *     WindowControlInput:
 *       type: object
 *       properties:
 *         state:
 *           type: string
 *           description: The command to control the window (e.g., OPEN, CLOSE).
 *           default: CLOSED
 *         pincode:
 *           type: string
 *           description: The pincode for authorization.
 *           default: 12345
 * 
 *     CreateWindowInput:
 *       type: object
 *       properties:
 *         pincode:
 *           type: string
 *           description: The pincode of the window.
 *           default: 12345
 */