import { PrismaClient } from "@prisma/client";

export class PrismaConnection {
    public static prisma = new PrismaClient()

    public static async createDatabase(dbName: string) {

        try {
            await this.prisma.$queryRaw`CREATE DATABASE ${dbName}`;
            console.log(`Database ${dbName} created successfully.`);
        } catch (error) {
            console.error(`Error creating database ${dbName}: `, error);
        } finally {
            await this.prisma.$disconnect();
        }
    }
}