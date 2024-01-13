/*
  Warnings:

  - Added the required column `socketId` to the `online_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "online_users" ADD COLUMN     "socketId" TEXT NOT NULL;
