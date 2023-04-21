/*
  Warnings:

  - A unique constraint covering the columns `[productId,order]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `href` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "href" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productId_order_key" ON "ProductImage"("productId", "order");
