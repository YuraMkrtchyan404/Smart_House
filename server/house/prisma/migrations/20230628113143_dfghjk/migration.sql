/*
  Warnings:

  - You are about to drop the column `pin_code` on the `Sensors` table. All the data in the column will be lost.
  - Added the required column `pincode` to the `Sensors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sensors" DROP COLUMN "pin_code",
ADD COLUMN     "pincode" TEXT NOT NULL;
