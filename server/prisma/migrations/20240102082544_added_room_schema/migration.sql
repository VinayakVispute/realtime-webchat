/*
  Warnings:

  - You are about to drop the `OnlineUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OnlineUser" DROP CONSTRAINT "OnlineUser_userName_fkey";

-- DropTable
DROP TABLE "OnlineUser";

-- CreateTable
CREATE TABLE "online_users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "online_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_users" ADD CONSTRAINT "online_users_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_users" ADD CONSTRAINT "online_users_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
