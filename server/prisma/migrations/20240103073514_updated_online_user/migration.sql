/*
  Warnings:

  - Added the required column `receiver` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "receiver" TEXT NOT NULL;
