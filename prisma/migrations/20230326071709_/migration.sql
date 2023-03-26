/*
  Warnings:

  - Added the required column `provider` to the `ShippingMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipping" ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "trackingProvider" TEXT,
ADD COLUMN     "trackingUrl" TEXT;

-- AlterTable
ALTER TABLE "ShippingMethod" ADD COLUMN     "description" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL,
ALTER COLUMN "cost" DROP NOT NULL;
