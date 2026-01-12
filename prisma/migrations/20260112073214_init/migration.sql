-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueAccess" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "VenueAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueManager" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "VenueManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedPerson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,

    CONSTRAINT "BannedPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertDetail" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "AlertDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanDetail" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "BanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanDetailVenue" (
    "id" SERIAL NOT NULL,
    "banId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "BanDetailVenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_key" ON "Venue"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAccess" ADD CONSTRAINT "VenueAccess_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAccess" ADD CONSTRAINT "VenueAccess_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueManager" ADD CONSTRAINT "VenueManager_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueManager" ADD CONSTRAINT "VenueManager_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertDetail" ADD CONSTRAINT "AlertDetail_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertDetail" ADD CONSTRAINT "AlertDetail_personId_fkey" FOREIGN KEY ("personId") REFERENCES "BannedPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanDetail" ADD CONSTRAINT "BanDetail_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanDetail" ADD CONSTRAINT "BanDetail_personId_fkey" FOREIGN KEY ("personId") REFERENCES "BannedPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanDetailVenue" ADD CONSTRAINT "BanDetailVenue_banId_fkey" FOREIGN KEY ("banId") REFERENCES "BanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanDetailVenue" ADD CONSTRAINT "BanDetailVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
