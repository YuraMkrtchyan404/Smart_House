/*
  Warnings:

  - The `state` column on the `Sensors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sensors" DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'CLOSED';

-- DropEnum
DROP TYPE "State";
