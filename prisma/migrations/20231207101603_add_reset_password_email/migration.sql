-- CreateTable
CREATE TABLE "ResetPasswordEmail" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordEmail_userId_key" ON "ResetPasswordEmail"("userId");

-- AddForeignKey
ALTER TABLE "ResetPasswordEmail" ADD CONSTRAINT "ResetPasswordEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
