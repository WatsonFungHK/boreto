-- DropForeignKey
ALTER TABLE "Designation" DROP CONSTRAINT "Designation_DepartmentId_fkey";

-- AlterTable
ALTER TABLE "Benefit" ALTER COLUMN "designationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Designation" ALTER COLUMN "DepartmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_DepartmentId_fkey" FOREIGN KEY ("DepartmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
