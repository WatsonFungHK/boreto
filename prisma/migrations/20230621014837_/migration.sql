/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addresses` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joined_date` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "addresses" TEXT NOT NULL,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "joined_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "officeId" TEXT,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
