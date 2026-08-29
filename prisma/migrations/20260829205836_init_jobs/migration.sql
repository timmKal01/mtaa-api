-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('posted', 'accepted', 'picked_up', 'delivered');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "what" TEXT NOT NULL,
    "pickup" TEXT NOT NULL,
    "dropoff" TEXT NOT NULL,
    "when" TEXT NOT NULL,
    "budgetKes" INTEGER,
    "customerClerkId" TEXT,
    "customerEmail" TEXT,
    "providerClerkId" TEXT,
    "providerEmail" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'posted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
