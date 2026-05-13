-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLISHED', 'PENDING_REVIEW', 'REJECTED');

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "vehicleDesc" TEXT,
    "incidentAt" TIMESTAMP(3) NOT NULL,
    "aiConfidence" TEXT,
    "aiReasoning" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);
