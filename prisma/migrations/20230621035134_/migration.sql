-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_designationId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "designationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
