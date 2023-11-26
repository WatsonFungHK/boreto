/*
  Warnings:

  - Added the required column `remark` to the `Payslip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payslip" ADD COLUMN     "remark" TEXT NOT NULL;
