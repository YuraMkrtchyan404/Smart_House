/*
  Warnings:

  - You are about to drop the `Door` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `House` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sensor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Window` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Door" DROP CONSTRAINT "Door_house_id_fkey";

-- DropForeignKey
ALTER TABLE "Door" DROP CONSTRAINT "Door_sensor_id_fkey";

-- DropForeignKey
ALTER TABLE "Window" DROP CONSTRAINT "Window_house_id_fkey";

-- DropForeignKey
ALTER TABLE "Window" DROP CONSTRAINT "Window_sensor_id_fkey";

-- DropTable
DROP TABLE "Door";

-- DropTable
DROP TABLE "House";

-- DropTable
DROP TABLE "Sensor";

-- DropTable
DROP TABLE "Window";

-- CreateTable
CREATE TABLE "Sensors" (
    "sensor_id" SERIAL NOT NULL,
    "state" "State" NOT NULL DEFAULT 'CLOSED',
    "pin_code" TEXT NOT NULL,

    CONSTRAINT "Sensors_pkey" PRIMARY KEY ("sensor_id")
);

-- CreateTable
CREATE TABLE "Windows" (
    "window_id" SERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "house_id" INTEGER,

    CONSTRAINT "Windows_pkey" PRIMARY KEY ("window_id")
);

-- CreateTable
CREATE TABLE "Doors" (
    "door_id" SERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,

    CONSTRAINT "Doors_pkey" PRIMARY KEY ("door_id")
);

-- CreateTable
CREATE TABLE "Houses" (
    "house_id" SERIAL NOT NULL,

    CONSTRAINT "Houses_pkey" PRIMARY KEY ("house_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Windows_sensor_id_key" ON "Windows"("sensor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Doors_sensor_id_key" ON "Doors"("sensor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Doors_house_id_key" ON "Doors"("house_id");

-- AddForeignKey
ALTER TABLE "Windows" ADD CONSTRAINT "Windows_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "Sensors"("sensor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Windows" ADD CONSTRAINT "Windows_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "Houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doors" ADD CONSTRAINT "Doors_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "Sensors"("sensor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doors" ADD CONSTRAINT "Doors_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "Houses"("house_id") ON DELETE RESTRICT ON UPDATE CASCADE;
