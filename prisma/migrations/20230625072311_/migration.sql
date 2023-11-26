/*
  Warnings:

  - You are about to drop the column `designationId` on the `Benefit` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('ANNUAL_LEAVE', 'SICK_LEAVE', 'NO_PAY_LEAVE', 'OTHERS');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "timeIn" TIMESTAMP(3),
ADD COLUMN     "timeOut" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "designationId";

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "hourlyRate" INTEGER,
ALTER COLUMN "basicPay" DROP NOT NULL,
ALTER COLUMN "allowance" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "employment_type" TEXT NOT NULL DEFAULT 'FT';

-- CreateTable
CREATE TABLE "Leave" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeIn" TIMESTAMP(3),
    "timeOut" TIMESTAMP(3),
    "leaveType" "LeaveType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A',
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "StaffId" TEXT NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
