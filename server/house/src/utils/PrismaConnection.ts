import { PrismaClient } from "@prisma/client";

/**
 * Class for establishing connection to the Prisma Client
 */
export class PrismaConnection {
    public static prisma = new PrismaClient()
}