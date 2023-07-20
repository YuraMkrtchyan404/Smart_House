/**
 * @openapi
 * components:
 *   schemas:
 *     CreateOwnerInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           default: Poghos
 *         email:
 *           type: string
 *           default: poghospoghsyan@gmail.com
 *         password:
 *           type: string
 *           default: strongPassword
 *  
 *     LoginOwnerInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           default: poghospoghsyan@gmail.com
 *         password:
 *           type: string      
 *           default: strongPassword
 * 
 *     LoginOwnerResponse:
 *       type: object
 *       properties:
 *         owner:
 *           $ref: '#/components/schemas/Owner'
 *         token:
 *           type: string
 * 
 *     Owner:
 *       type: object
 *       properties:
 *         owner_id:
 *           type: integer
 *         email:
 *           type: string
 *         name:
 *           type: string
*/