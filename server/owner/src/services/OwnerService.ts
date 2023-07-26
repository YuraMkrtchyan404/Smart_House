import { Owner } from "../models/Owner"
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from "lodash"

/**
 * Class for business logic related to Owners
 */
export class OwnerService {
    /**
     * Registers a new owner
     * @param data 
     * @returns The registered Owner object along with the JWT token
     */
    public static async registerOwner(data: { name: string, password: string, email: string }) {
        const ownerWithoutPassword = await (new Owner(data.name, data.password, data.email)).saveOwner()
        const owner_id = ownerWithoutPassword.owner_id.toString()
        const token = OwnerService.generateToken(owner_id)

        return { owner: ownerWithoutPassword, token: token }
    }

    /**
     * Logges in an owner
     * @param data 
     * @returns The logged in Owner object along with JWT token
     */
    public static async loginOwner(data: { email: string, password: string }) {
        const password: string = data.password
        const owner = await new Owner(undefined, data.password, data.email).findOwnerByEmail()

        if (owner && await bcrypt.compare(password, owner.password)) {
            const token = OwnerService.generateToken(owner.owner_id.toString())
            const ownerWithoutPassword = _.omit(owner, 'password')
            return { owner: ownerWithoutPassword, token: token }
        } else {
            throw new Error('Wrong credentials: try again')
        }
    }

    /**
     * Generates a new JWT token using owner_id
     * @param owner_id 
     * @returns JWT token
     */
    private static generateToken(owner_id: string): string {
        const jwt_secret_key = process.env.JWT_SECRET_KEY
        const token = jwt.sign({ id: owner_id }, jwt_secret_key!, { expiresIn: '1h' });
        return token;
    }
}