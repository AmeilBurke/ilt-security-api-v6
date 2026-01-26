/*
  Warnings:

  - A unique constraint covering the columns `[banId,venueId]` on the table `BanDetailVenue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,venueId]` on the table `VenueAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BanDetailVenue_banId_venueId_key" ON "BanDetailVenue"("banId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueAccess_accountId_venueId_key" ON "VenueAccess"("accountId", "venueId");
