/*
  Warnings:

  - You are about to drop the column `roomId` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "roomId",
ADD COLUMN     "isRoom" BOOLEAN NOT NULL DEFAULT true;
