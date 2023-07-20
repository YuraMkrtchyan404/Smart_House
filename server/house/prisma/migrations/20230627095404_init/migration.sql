-- CreateEnum
CREATE TYPE "State" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Sensor" (
    "sensor_id" SERIAL NOT NULL,
    "state" "State" NOT NULL DEFAULT 'CLOSED',
    "pin_code" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("sensor_id")
);

-- CreateTable
CREATE TABLE "Window" (
    "window_id" SERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "houseHouse_id" INTEGER,

    CONSTRAINT "Window_pkey" PRIMARY KEY ("window_id")
);

-- CreateTable
CREATE TABLE "Door" (
    "door_id" SERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("door_id")
);

-- CreateTable
CREATE TABLE "House" (
    "house_id" SERIAL NOT NULL,
    "door_id" INTEGER NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("house_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Window_sensor_id_key" ON "Window"("sensor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Door_sensor_id_key" ON "Door"("sensor_id");

-- CreateIndex
CREATE UNIQUE INDEX "House_door_id_key" ON "House"("door_id");

-- AddForeignKey
ALTER TABLE "Window" ADD CONSTRAINT "Window_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "Sensor"("sensor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Window" ADD CONSTRAINT "Window_houseHouse_id_fkey" FOREIGN KEY ("houseHouse_id") REFERENCES "House"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "Sensor"("sensor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_door_id_fkey" FOREIGN KEY ("door_id") REFERENCES "Door"("door_id") ON DELETE RESTRICT ON UPDATE CASCADE;
