/*
  Warnings:

  - You are about to drop the column `method` on the `Shipping` table. All the data in the column will be lost.
  - Added the required column `methodId` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingMethodId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "method",
ADD COLUMN     "methodId" TEXT NOT NULL,
ADD COLUMN     "shippingMethodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ShippingMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "ShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
