/*
  Warnings:

  - A unique constraint covering the columns `[sumupReference]` on the table `VoucherPurchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VoucherPurchase" ADD COLUMN     "sumupReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VoucherPurchase_sumupReference_key" ON "VoucherPurchase"("sumupReference");
