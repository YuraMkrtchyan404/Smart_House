/*
  Warnings:

  - You are about to drop the column `sensore_state` on the `Sensors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sensors" DROP COLUMN "sensore_state",
ADD COLUMN     "state" "State" NOT NULL DEFAULT 'CLOSED';
