/*
  Warnings:

  - You are about to drop the `AlertDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BanDetailVenue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VenueAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VenueManager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlertDetail" DROP CONSTRAINT "AlertDetail_personId_fkey";

-- DropForeignKey
ALTER TABLE "AlertDetail" DROP CONSTRAINT "AlertDetail_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "BanDetailVenue" DROP CONSTRAINT "BanDetailVenue_banId_fkey";

-- DropForeignKey
ALTER TABLE "BanDetailVenue" DROP CONSTRAINT "BanDetailVenue_venueId_fkey";

-- DropForeignKey
ALTER TABLE "VenueAccess" DROP CONSTRAINT "VenueAccess_accountId_fkey";

-- DropForeignKey
ALTER TABLE "VenueAccess" DROP CONSTRAINT "VenueAccess_venueId_fkey";

-- DropForeignKey
ALTER TABLE "VenueManager" DROP CONSTRAINT "VenueManager_accountId_fkey";

-- DropForeignKey
ALTER TABLE "VenueManager" DROP CONSTRAINT "VenueManager_venueId_fkey";

-- DropTable
DROP TABLE "AlertDetail";

-- DropTable
DROP TABLE "BanDetailVenue";

-- DropTable
DROP TABLE "VenueAccess";

-- DropTable
DROP TABLE "VenueManager";
