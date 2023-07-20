import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'

export class AuthenticateMiddleware {
    public static async authenticate(req: Request, res: Response, next: NextFunction) {
        console.log('MIDDLEWARE STARTED. AUTH IS: ', req.headers.authorization);
        
        // console.log('REQUEST HEADERS: ', req.headers)
        const authHeader = req.headers.authorization
        console.log("AUTH: " + authHeader);
        
        if (!authHeader) {
            return res.status(401).send({ error: 'Missing authorization header' })
        }        
        const token = authHeader.split(' ')[1]
        console.log('token: ', token)
        try {
            const jwt_secret_key = process.env.JWT_SECRET_KEY
            const decoded = jwt.verify(token, jwt_secret_key!)
            req.body.decodedOwner = decoded
            console.log(`decoded: ${req.body.decodedOwner}`);
            
            console.log('END OF MIDDLEWARE. AUTH IS: ', req.headers.authorization);
            
            next()
        } catch (err) {
            return res.status(401).send({ error: err })
        }
    }
}
