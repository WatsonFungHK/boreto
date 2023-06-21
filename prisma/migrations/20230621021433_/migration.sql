/*
  Warnings:

  - You are about to drop the column `addresses` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `StaffId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "StaffId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "addresses",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
