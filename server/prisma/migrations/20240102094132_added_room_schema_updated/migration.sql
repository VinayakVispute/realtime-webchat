-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_roomId_fkey";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
