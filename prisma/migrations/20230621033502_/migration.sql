-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_StaffId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "StaffId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
