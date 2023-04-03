-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'A',
ADD COLUMN     "updatedAt" TIMESTAMP(3);
