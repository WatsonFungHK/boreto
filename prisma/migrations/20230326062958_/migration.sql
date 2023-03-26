/*
  Warnings:

  - You are about to drop the column `address` on the `Shipping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Shipping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_addressId_key" ON "Shipping"("addressId");

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
