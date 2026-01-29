/*
  Warnings:

  - You are about to drop the column `isPending` on the `BanDetail` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedById` on the `BanDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BanDetail" DROP CONSTRAINT "BanDetail_uploadedById_fkey";

-- AlterTable
ALTER TABLE "BanDetail" DROP COLUMN "isPending",
DROP COLUMN "uploadedById";
