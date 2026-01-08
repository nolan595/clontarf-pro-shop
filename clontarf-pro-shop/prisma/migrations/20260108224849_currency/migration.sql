/*
  Warnings:

  - You are about to alter the column `amount` on the `VoucherPurchase` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- CreateEnum
CREATE TYPE "VoucherPurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "VoucherPurchase" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "status" "VoucherPurchaseStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
