/*
  Warnings:

  - You are about to drop the column `state` on the `Sensors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sensors" DROP COLUMN "state",
ADD COLUMN     "sensore_state" "State" NOT NULL DEFAULT 'CLOSED';
