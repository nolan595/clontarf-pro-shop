/*
  Warnings:

  - A unique constraint covering the columns `[sumupCheckoutId]` on the table `VoucherPurchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VoucherPurchase" ADD COLUMN     "emailedAt" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "sumupCheckoutId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VoucherPurchase_sumupCheckoutId_key" ON "VoucherPurchase"("sumupCheckoutId");
