import { Owner } from "../models/Owner"
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from "lodash"


export class OwnerService {
    public static async registerOwner(data: { name: string, password: string, email: string }) {
        const ownerWithoutPassword = await (new Owner(data)).saveOwner()
        const owner_id = ownerWithoutPassword.owner_id.toString()
        const token = OwnerService.generateToken(owner_id)

        return { owner: ownerWithoutPassword, token: token }
    }

    public static async loginOwner(data: { email: string, password: string }) {
        const password: string = data.password
        const owner = await new Owner(data).findOwnerByEmail()

        if (owner && await bcrypt.compare(password, owner.password)) {
            const token = OwnerService.generateToken(owner.owner_id.toString())
            const ownerWithoutPassword = _.omit(owner, 'password')
            return { owner: ownerWithoutPassword, token: token }
        } else {
            throw new Error('Wrong credentials: try again')
        }
    }

    private static generateToken(userId: string): string {
        const jwt_secret_key = process.env.JWT_SECRET_KEY
        const token = jwt.sign({ id: userId }, jwt_secret_key!, { expiresIn: '1h' });
        return token;
    }
}