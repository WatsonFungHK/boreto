/*
  Warnings:

  - You are about to drop the column `addressId` on the `Office` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Office" DROP CONSTRAINT "Office_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "officeId" TEXT;

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "addressId";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
