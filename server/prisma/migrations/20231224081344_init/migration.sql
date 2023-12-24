/*
  Warnings:

  - You are about to drop the column `text` on the `messages` table. All the data in the column will be lost.
  - Added the required column `author` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "text",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;
