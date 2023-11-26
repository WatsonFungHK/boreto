/*
  Warnings:

  - You are about to drop the column `DepartmentId` on the `Designation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Designation" DROP CONSTRAINT "Designation_DepartmentId_fkey";

-- AlterTable
ALTER TABLE "Designation" DROP COLUMN "DepartmentId",
ADD COLUMN     "departmentId" TEXT;

-- AlterTable
ALTER TABLE "Payslip" ALTER COLUMN "remark" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
