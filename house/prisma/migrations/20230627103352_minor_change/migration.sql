/*
  Warnings:

  - You are about to drop the column `door_id` on the `House` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[house_id]` on the table `Door` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `house_id` to the `Door` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "House" DROP CONSTRAINT "House_door_id_fkey";

-- DropIndex
DROP INDEX "House_door_id_key";

-- AlterTable
ALTER TABLE "Door" ADD COLUMN     "house_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "House" DROP COLUMN "door_id";

-- CreateIndex
CREATE UNIQUE INDEX "Door_house_id_key" ON "Door"("house_id");

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("house_id") ON DELETE RESTRICT ON UPDATE CASCADE;
