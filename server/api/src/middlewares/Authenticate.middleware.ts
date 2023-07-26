import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'

/**
 * Authentication MIddleware class
 */
export class AuthenticateMiddleware {
    /**
     * Authentication middlewere
     * @param req 
     * @param res 
     * @param next 
     * @returns void
     */
    public static async authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).send({ error: 'Missing authorization header' })
        }
        const token = authHeader.split(' ')[1]
        try {
            const jwt_secret_key = process.env.JWT_SECRET_KEY
            const decoded = jwt.verify(token, jwt_secret_key!)
            req.body.decodedOwner = decoded
            next()
        } catch (err) {
            return res.status(401).send({ error: err })
        }
    }
}
