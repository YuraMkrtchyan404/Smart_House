import { PrismaClient } from "@prisma/client";

export class PrismaConnection{
    public static prisma = new PrismaClient()
}