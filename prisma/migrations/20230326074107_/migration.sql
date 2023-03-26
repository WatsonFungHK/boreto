/*
  Warnings:

  - You are about to drop the column `shippingMethodId` on the `Shipping` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_shippingMethodId_fkey";

-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "shippingMethodId";

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
