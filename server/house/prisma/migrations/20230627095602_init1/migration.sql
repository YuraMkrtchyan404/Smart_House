/*
  Warnings:

  - You are about to drop the column `houseHouse_id` on the `Window` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Window" DROP CONSTRAINT "Window_houseHouse_id_fkey";

-- AlterTable
ALTER TABLE "Window" DROP COLUMN "houseHouse_id",
ADD COLUMN     "house_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Window" ADD CONSTRAINT "Window_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;
