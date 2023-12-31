/*
  Warnings:

  - Added the required column `userName` to the `OnlineUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OnlineUser" DROP CONSTRAINT "OnlineUser_id_fkey";

-- AlterTable
ALTER TABLE "OnlineUser" ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OnlineUser" ADD CONSTRAINT "OnlineUser_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
