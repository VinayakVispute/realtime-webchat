/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "online_users" DROP CONSTRAINT "online_users_roomId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomId_key" ON "rooms"("roomId");

-- AddForeignKey
ALTER TABLE "online_users" ADD CONSTRAINT "online_users_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
