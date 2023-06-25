/*
  Warnings:

  - You are about to drop the `Salary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_staffId_fkey";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "basicPay" INTEGER,
ADD COLUMN     "hourlyRate" INTEGER;

-- DropTable
DROP TABLE "Salary";

-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "payPeriod" TEXT NOT NULL,
    "settleDate" TEXT NOT NULL,
    "basicPay" INTEGER,
    "deduction" INTEGER,
    "MPF" INTEGER,
    "allowance" INTEGER,
    "netSalary" INTEGER,
    "payrollStatus" "PayrollStatus" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "staffId" TEXT NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
